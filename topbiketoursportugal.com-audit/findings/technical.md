## Score: 58/100

## What works

- **robots.txt**: `User-Agent: *` / `Disallow:` (nothing blocked) +
  `Sitemap: https://topbiketoursportugal.com/sitemap-index.xml`. Validated with
  `sitemap_discovery.py`: the declared sitemap index returns HTTP 200, parses as
  a valid `sitemapindex`. No stale/incorrect declaration.
- **Redirects (`dist/_redirects`, 900 rules)**: parsed and cross-checked
  programmatically —
  - 0 duplicate source rules (no shadowed/conflicting rules).
  - 0 internal chains: no rule's destination is itself the source of another
    rule (confirms the repo's own claim that `url-history.mjs` collapses history
    to a single hop per URL).
  - 0 self-referential loops (`src == dest`).
  - All 900 rules use status 301 (no mixed 301/302 inconsistency).
  - All internal redirect destinations resolve to an actual page in `dist/` (0
    redirects pointing at a 404).
  - Legacy numbered blog pagination URLs (`/blog/2/` … `/blog/15/`,
    `/blog/news/`, `/blog/updates/`) are correctly 301'd to `/blog/` rather than
    left as live thin pages.
- **HTTPS / host consolidation (live host, verified via `curl -I`)**:
  - `http://topbiketoursportugal.com/` → 301 →
    `https://topbiketoursportugal.com/` (single hop).
  - `http://www.topbiketoursportugal.com/` → 301 →
    `https://www.topbiketoursportugal.com/` → 301 →
    `https://topbiketoursportugal.com/` (two hops — see finding).
  - `https://www.topbiketoursportugal.com/` → 301 →
    `https://topbiketoursportugal.com/` (single hop). End state is consistently
    the bare-apex HTTPS URL.
- **HSTS** is present (`strict-transport-security: max-age=31536000`) on the
  live host.
- Taxonomy listing pages (`/tours/tags/nature/`, `/tours/regions/algarve/`,
  etc.) each carry `<meta name="robots" content="index, follow">` and a correct
  **self-referencing canonical** — the indexing signal itself isn't broken, only
  the content behind it (see Critical finding below).

## Findings

### Critical: Tour taxonomy pages serve identical content regardless of the filter in the URL

Evidence: diffed the rendered `<a href="/tours/...">` link sets in `dist/` for
six taxonomy pages spanning three different taxonomies — `tours/tags/nature/`,
`tours/tags/wine/`, `tours/regions/algarve/`, `tours/regions/lisbon/`,
`tours/rider-levels/beginner/`, `tours/rider-levels/advanced/`.

All six return the exact same 20 tour links in the exact same order. A "Nature"
tag page and a "Wine" tag page list identical tours; the Algarve region page
lists the same tours as the Lisbon region page; "Beginner" and "Advanced"
rider-level pages are identical to each other. Only the H1, title, and intro
copy differ between them. `tours/bike-types/e-bike/` shows the same 24-link
pattern.

I read the generating template
(`src/pages/[...language]/tours/tags/[tag].astro`) and the filter logic itself
is correct at the code level —
`tours.filter((tour) => tour.data.tags?.includes(tag.data.id) && tour.data.language === language)`.
Given identical output across categories that should be mutually exclusive-ish
(a beginner tour set should not equal an advanced tour set), the most likely
explanation is a content-data problem — every published tour entry is tagged
with every tag/region/rider-level ID rather than the correct subset — but I did
not open individual tour frontmatter files to confirm this before being asked to
stop investigating, so treat the root cause as inferred, not confirmed (see Not
Assessed).

Regardless of root cause, the observable, confirmed fact is: ~13 tag pages + 6
region pages + 3 rider-level pages + 5 bike-type pages (≈27 indexable URLs) are
indexable, canonically self-referencing, and content-identical to each other
except for boilerplate. This is classic index bloat / near-duplicate content on
exactly the kind of page (taxonomy/category) Google is most likely to filter,
and it also breaks the on-site UX promise ("Beginner Cycling Tours" showing
advanced tours too).

Fix:

1. Confirm/fix the tag/region/rider-level/bike-category assignments in the tour
   content collection so each tour only carries the terms that actually apply to
   it.
2. Re-render and re-diff the same six pages to confirm each now returns a
   distinct, smaller subset.
3. For any taxonomy term that legitimately has very few (1-2) matching tours
   after the fix, set `no_index: true` (the frontmatter already supports it —
   see `frontmatter.seo.no_index` in the template) rather than leaving a
   near-empty page indexable.

### High: No CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, or Permissions-Policy on the live host

Evidence: `curl -sI https://topbiketoursportugal.com/` returns only
`strict-transport-security` as a security-relevant header. `content-type`,
`cache-control`, `etag`, `server`, `x-nf-request-id` are the only others.
Confirmed this isn't an artifact of `curl`: there is no `dist/_headers` file and
no `[[headers]]` block in `netlify.toml` (`netlify.toml` contains only
`[build.processing.html] pretty_urls = true`), and no headers config in
`astro.config.*`. Netlify does not inject these by default, so the site
currently ships none of: `Content-Security-Policy`, `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`.

This isn't a direct ranking factor, but it is a standard item in any
technical/security audit and Lighthouse's "Best Practices" score will flag it,
which does roll into some holistic quality assessments and is trivial to fix on
Netlify.

Fix: add `dist/_headers` (or a `public/_headers` that Astro copies through) with
at minimum:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), camera=(), microphone=()
```

A CSP needs to be scoped against the actual third-party script inventory (GTM,
Pagefind, the PWA service worker, etc. were all observed inline in taxonomy page
`<script>` tags) — build it incrementally with
`Content-Security-Policy-Report-Only` first rather than shipping a guessed
policy.

### Low: `http://www` requests take two redirect hops to reach the canonical URL

Evidence: `curl -sIL http://www.topbiketoursportugal.com/` shows `http://www` →
301 → `https://www` → 301 → `https://apex`. The first hop is Netlify's
platform-level force-SSL (preserves host), the second is the site's own www→apex
consolidation rule; they can't be merged in a single `_redirects` rule since
Netlify's SSL enforcement runs first. Every other entry point (`http` apex,
`https www`) reaches the final URL in one hop.

Impact is small — this only affects inbound links that are both `http://` and
`www.`, an increasingly rare combination — but each hop is a small amount of
lost equity and added latency for whatever traffic still uses old `www` links
(e.g. old business listings, historical backlinks).

Fix: not fixable purely in `_redirects` since Netlify's SSL redirect runs
upstream of the redirects engine; if this matters, a Netlify Edge Function on
the `www` hostname that 301s straight to the apex HTTPS URL would collapse it to
one hop. Low priority given traffic likely near zero.

### Low: One `_redirects` rule uses single-space formatting instead of the file's double-space column alignment

Evidence: line 135 of `dist/_redirects`
(`/static/97c7f99891d93d2ca6203996cd70ba00/27d3a/the-way-of-st.-james-bike-tour-fold-n-visit-cycling-holidays-3582-1280x853-1-.jpg/ /tours/porto-to-coimbra-biketour/#image-2/ 301`)
is not padded like the surrounding 899 rules. Netlify's `_redirects` parser
splits on generic whitespace, so this rule still functions correctly — this is a
cosmetic/generator inconsistency, not a functional redirect bug. Worth a look at
the generator script (`tools/seo/url-history.mjs` per the `astro.config`
comment) for why this one source path didn't get column-padded, but it carries
no SEO risk today.

## Not assessed

Ran out of budget before completing; flagging rather than guessing:

- **Root cause of the taxonomy duplicate-content finding above**: whether it's a
  content-data issue (every tour tagged with every term) versus something else
  in the collection query — I read the template code (which is correct) but did
  not open individual tour `.mdx`/frontmatter files in `src/content/tours/` to
  confirm the tag/region/rider-level arrays.
- **Blog pagination on the current site**: confirmed the _legacy_ numbered
  pagination URLs (`/blog/2/` … `/blog/15/`) now 301 to `/blog/`, but did not
  verify what URL pattern (if any) the _current_ blog listing uses for pages
  beyond the first, or whether that current scheme is indexable/canonicalized
  correctly.
- **Viewport meta tag and touch-target sizing**: not explicitly checked.
  Incidentally observed Tailwind responsive utility classes (`md:flex`,
  `md:hidden`, `dark:hidden`, etc.) on taxonomy pages, which is circumstantial
  evidence of a responsive design but not a mobile audit.
- **Core Web Vitals** (LCP/INP/CLS risk from source inspection: render-blocking
  resources, image dimensions/`loading` attributes, layout-shift-prone elements,
  main-thread JS cost).
- **Structured data validation** beyond noting that `LocalBusiness` and
  `BreadcrumbList` JSON-LD blocks are present on at least one taxonomy page —
  not validated against schema.org requirements or tested in a rich-results
  checker.
- **JS-dependency of primary content and nav**: confirmed via context that the
  site is static Astro (not an SPA), and directly observed that taxonomy page
  body content (tour listings, headings) is present in raw server-rendered HTML
  rather than injected by JS. Did not specifically verify the primary navigation
  menu's mobile toggle or the on-page tour filter widget (`data-filter-bar`,
  `data-tour-filter-container` — a client-side search/filter UI distinct from
  the taxonomy pages themselves) degrade gracefully without JS.
- **IndexNow protocol** (Bing/Yandex/Naver) — not checked at all.
- **Meta descriptions / title tag quality and duplication** at scale across the
  447 URLs — only spot-checked on taxonomy pages.
