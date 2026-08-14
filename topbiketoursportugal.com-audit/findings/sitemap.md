## Score: 62/100

## What works

- Sitemap XML is well-formed (`dist/sitemap-index.xml` → `dist/sitemap-0.xml`),
  single-file index pattern, valid `urlset`/`sitemapindex` structure with
  correct namespaces (including `xhtml:link` for hreflang).
- Well under the 50,000 URL / 50MB caps: 447 URLs in `sitemap-0.xml`.
- No deprecated `priority`/`changefreq` tags present — Google-ignored fields
  already absent.
- Most URLs (423/447 = 94.6%) carry `lastmod`, and most (426/447 = 95.3%) carry
  full en/pt/x-default hreflang triples.
- `/thank-you-page/` (post-conversion page) correctly carries
  `<meta name="robots" content="noindex, follow">` in the rendered HTML — it
  will not be indexed even though it is listed in the sitemap.
- Real, unique en/pt tour detail pages (21 + 21 = 42) each have distinct H1s and
  substantive body copy — these are legitimate, not doorway pages.
- Taxonomy landing pages (checked samples: `/tours/tags/city-tours/`,
  `/tours/tags/mountain/`, `/tours/rider-levels/beginner/`,
  `/tours/regions/porto/`) do have genuine unique intro copy (50–110 words)
  above the tour-card grid, not simply a swapped noun in a template — this is a
  mitigating factor, but volume/thinness relative to the pages they compete with
  is still a problem (see Critical finding below).

## Findings

### Critical: Taxonomy/pagination pages outnumber the real content they index, and are cannibalising tour rankings

Counted directly from `dist/sitemap-0.xml` (447 URLs total):

| Pattern                                                                             | EN count | PT count | Total                               |
| ----------------------------------------------------------------------------------- | -------- | -------- | ----------------------------------- |
| `/tours/regions/<region>/`                                                          | 6        | 6        | 12                                  |
| `/tours/tags/<tag>/`                                                                | 12       | 8        | 20                                  |
| `/tours/rider-levels/<level>/`                                                      | 3        | 3        | 6                                   |
| `/tours/bike-types/<type>/`                                                         | 5        | 5        | 10                                  |
| `/tours/tags/`, `/tours/rider-levels/`, `/tours/bike-types/` (taxonomy index pages) | 3        | 3        | 6                                   |
| **Tours-taxonomy subtotal**                                                         |          |          | **54**                              |
| `/blog/tags/<tag>/`                                                                 | 12       | 12       | 24                                  |
| `/blog/tags/<tag>/2/`, `/3/`, `/4/`, `/5/` (pagination)                             | 15       | 1        | 16                                  |
| **Blog-taxonomy subtotal**                                                          |          |          | **40**                              |
| **Grand total thin taxonomy/pagination URLs**                                       |          |          | **94 (21% of the 447-URL sitemap)** |

For comparison, there are only **42 actual tour detail pages** (`/tours/<slug>/`
en + pt) in the whole sitemap — meaning the site has **more taxonomy pages (54)
than actual tours (42)** it is meant to organize. This directly matches the
Search Console symptom described: taxonomy pages
(region/tag/rider-level/bike-type hubs) outranking the tour pages they list,
because there are more of them, they all target overlapping head/mid-tail
keywords (e.g. `/tours/regions/porto/` vs `/tours/tags/city-tours/` vs
`/tours/bike-types/e-bike/` all plausibly rank for "porto e-bike tour"), and
each only has ~50–110 words of unique copy versus a full tour page.

**Recommendation — specific patterns to noindex and drop from the sitemap:**

1. `/blog/tags/<tag>/2/`, `/3/`, `/4/`, `/5/` — all 16 paginated blog-tag URLs
   (en 15 + pt 1). Pure pagination of an already-thin tag archive; zero unique
   value. **Remove from sitemap, add
   `<meta name="robots" content="noindex,follow">` to page ≥2 of every
   archive.**
2. `/tours/tags/<tag>/` — 20 URLs (en 12 + pt 8). These are the most redundant
   layer: they overlap almost entirely with `/tours/rider-levels/` and
   `/tours/bike-types/`, which cover the same tours from a different facet. Keep
   at most 3–4 tag pages with genuine independent search demand (e.g. `wine`,
   `pilgrimage`) and noindex the rest, or fold tags into on-page filters
   (already present — the filter JS in each taxonomy page indicates client-side
   filtering exists, so these could become `noindex` filter views rather than
   separate crawlable/indexable URLs).
3. `/tours/rider-levels/<level>/` (6) and `/tours/bike-types/<type>/` (10) —
   lower priority than tags, but still compete with tour pages and with
   `/tours/regions/`. Consolidate ranking intent onto the 6 region pages (which
   have the most unique copy, ~106 words, and the clearest distinct search
   intent) and noindex bike-type/rider-level pages, or merge them as sections
   within the region pages instead of standalone URLs.
4. Sitemap-level taxonomy index pages `/tours/tags/`, `/tours/rider-levels/`,
   `/tours/bike-types/` (en+pt, 6 URLs) — these are just filter menus with no
   independent content; drop from sitemap regardless of noindex decision above.

**Net effect if 1–4 are applied:** removing items 1, 2, and 4 alone (16 + 20 + 6
= 42 URLs) cuts the sitemap from 447 to 405 URLs (−9.4%) and removes the layer
most directly duplicating tag/keyword targeting. Applying the
region/bike-type/rider-level consolidation in item 3 as well (16 more) would
bring the sitemap to 389 URLs (−13% total), leaving only regions (12) as the
surviving tours-taxonomy layer alongside the 42 real tour pages and full blog
corpus (270 posts + 24 tag pages if kept).

This finding is corroborated by, but independently verified from, the Search
Console cannibalisation symptom described in the brief (taxonomy pages ranking
above the tour pages they list; many taxonomy/thin pages at position 50–150 with
zero clicks) — the count of 94 thin URLs is a plausible source of that longtail,
no-click footprint.

### High: `/thank-you-page/` is listed in the XML sitemap despite being noindexed

`/thank-you-page/` (a post-conversion/confirmation page) is present in
`dist/sitemap-0.xml` with a `<loc>` entry, but the rendered page carries
`<meta name="robots" content="noindex, follow">`. Google's own guidance is that
noindexed URLs should not be included in the sitemap — submitting a noindex URL
in the sitemap sends a contradictory signal and wastes crawl budget/sitemap
"slots." It is also the only URL in the entire sitemap with no hreflang
alternates at all (see below), consistent with it being a utility page that was
included in the sitemap generation by accident rather than by design.
**Action:** remove `/thank-you-page/` from the sitemap generation logic entirely
(exclude by path or by checking the noindex flag at build time).

### High: 21 URLs missing hreflang alternates, 4 of which are orphaned EN tag pages with no PT counterpart

21 of 447 URLs (4.7%) have zero `<xhtml:link rel="alternate">` entries:

- `/thank-you-page/` (see above — utility page, should be excluded from sitemap
  entirely rather than fixed).
- 16 paginated blog-tag URLs:
  `/blog/tags/{algarve,camino-de-santiago,coastal-routes,cycling-tips,e-bikes,gastronomy-culture,portugal-cycling-guide,wine-douro-valley}/{2,3,4,5}/`
  (en) and `/pt/blog/tags/dicas-de-ciclismo/2/` (pt) — these inherit the
  missing-hreflang problem from their thin/pagination status; if kept, need
  pt/en pair alternates or, per the Critical finding, should simply be
  removed/noindexed.
- 4 EN-only tour tag pages with no PT equivalent at all:
  `/tours/tags/families/`, `/tours/tags/guided/`, `/tours/tags/premium/`,
  `/tours/tags/self-guided/`. This confirms the PT `/tours/tags/` taxonomy (8
  tags) and EN taxonomy (12 tags) are not in parity — 4 tags exist only in
  English. Either build the missing PT tag pages or, more efficiently, cut these
  4 EN pages per the Critical taxonomy-reduction recommendation and the parity
  problem disappears.

### Medium: 24 URLs (5.4%) missing `<lastmod>`, concentrated entirely in taxonomy/pagination

All 24 URLs lacking `lastmod` fall into the taxonomy patterns already flagged as
low-value:

- `/blog/tags/<tag>/2..5/` — 15 URLs (all EN blog-tag pagination pages)
- `/pt/blog/tags/dicas-de-ciclismo/2/` — 1 URL
- `/tours/tags/`, `/tours/rider-levels/`, `/tours/bike-types/` (EN) — 3 URLs
- `/pt/tours/tags/`, `/pt/tours/rider-levels/`, `/pt/tours/bike-types/` (PT) — 3
  URLs
- `/blog/ebike-in-portugal/` and `/pt/blog/ebike-em-portugal/` — 2 URLs (these
  are real blog posts, not taxonomy — worth checking why the build didn't stamp
  a lastmod for these two specifically; likely a missing/malformed frontmatter
  date field, since every other blog post in the corpus has one).

Cause: the sitemap generator appears to only emit `lastmod` when a
content-collection `updatedDate`/`pubDate` field is present; the
taxonomy/pagination routes are generated programmatically (not from a content
collection entry) and never get a date stamped, and two blog posts are likely
missing their frontmatter date. **Action:** for taxonomy pages, either remove
them from the sitemap (Critical finding) or derive `lastmod` from the most
recent `pubDate` among the tours/posts each page lists. For the 2 blog posts,
check frontmatter directly (not yet done — see Not assessed).

### Low: Sitemap coverage vs. build output — 451 built pages vs 447 in sitemap (4-page gap not yet attributed)

`find dist -name "*.html" | wc -l` returns 451 HTML files but only 447 URLs
appear in the sitemap. The 4-page difference has not yet been reconciled against
known exclusions (e.g., `404.html` is expected to be excluded, `thank-you-page`
IS included so isn't the explanation for a gap). This needs a direct diff of the
full `dist/` HTML file list against sitemap `<loc>` entries to identify the
exact 4 missing paths (see Not assessed).

## Not assessed

- Exact identification of the 4 pages built in `dist/` but absent from the
  sitemap (451 vs 447) — need a full path diff (404.html is one likely known
  exclusion; the other 3 are unconfirmed).
- Frontmatter inspection for `/blog/ebike-in-portugal/` and
  `/pt/blog/ebike-em-portugal/` to confirm why lastmod is missing for these two
  non-taxonomy posts specifically.
- Live HTTP status checks (200/301/404/noindex-via-header) for all 447 sitemap
  URLs — this audit was performed against local `dist/` build output only, not
  the deployed site; no crawl of the live site or Search Console API pull was
  performed in this session.
- Crawled-pages-vs-sitemap comparison — no external crawl data (e.g., Search
  Console "Pages" report, GSC coverage export, or third-party crawler output)
  was available to cross-check against sitemap coverage; only Search Console
  _symptoms_ were provided in the brief, not exportable data.
- `/pt/tours/regions/` vs `/tours/regions/` slug consistency (region slugs
  differ between languages — e.g. `douro-river` vs `douro`, `lisbon` vs
  `lisboatejo`, `porto` vs `portonorth`) was observed in passing but not
  evaluated for hreflang mapping correctness or user-facing URL-consistency
  risk.
- Full duplicate-content / similarity scoring across all 94 taxonomy pages (only
  4 sample pages were spot-checked for word count and copy uniqueness) — the
  60%+ unique-content quality-gate threshold from the location-page framework
  was not formally applied page-by-page.
- `robots.txt` directives were not reviewed to confirm they don't already
  noindex/disallow any of the flagged patterns.
