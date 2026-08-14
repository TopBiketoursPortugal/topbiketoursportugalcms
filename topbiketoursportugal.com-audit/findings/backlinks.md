# Backlink profile — topbiketoursportugal.com

## Score: 41/100

_Low-to-mixed confidence. Tier 0 only (Moz and Bing Webmaster keys are not
configured; DataForSEO returned HTTP 402 — out of credit — for the whole
session). The score blends a stale DataForSEO snapshot from 2026-08-12 with
fresh Common Crawl checks run today (2026-08-13). Two of the skill's seven
scoring factors (anchor text naturalness, link velocity) have no data source at
all and their weight was redistributed across the rest — see Data sources and
Not assessed below before trusting this number._

## Data sources

**MEASURED TODAY (2026-08-13):**

- **Common Crawl domain graph** (`commoncrawl_graph.py`, release
  `cc-main-2026-jan-feb-mar`, confidence 0.50): `topbiketoursportugal.com` —
  PageRank rank #4,391,537, harmonic centrality rank #9,319,335, `n_hosts: 2`,
  in-crawl and in-rankings.
- **Common Crawl CDX Index API**, queried directly against
  `index.commoncrawl.org` (public data, same tier as the graph script but
  URL-level rather than domain-level — the packaged `commoncrawl_graph.py`
  doesn't expose this; confidence 0.55, circumstantial not certain). Pulled all
  178 captures of `topbiketoursportugal.com/*` in the latest crawl
  (CC-MAIN-2026-30, crawled 2026-07-16). Four of those 178 carry
  `utm_source=ERR&utm_campaign=Epic+Road+Rides&utm_medium=epic-road-rides-referral`,
  landing on `/` (`utm_term=home`), `/guided-bike-tours-calendar-portugal/`,
  `/tours/porto-to-lisbon-bike-tour/`, and
  `/tours/porto-to-lisbon-cycling-tour-en/` (the last one now a 301) — the
  latter three all share `utm_term=cycling-the-portuguese-camino`. This lines up
  with the DataForSEO note that the three tour pages carrying any backlinks all
  trace to **one referring domain first seen 2026-05-23** — strong
  circumstantial identification of that domain as **epicroadrides.com**.
- Attempted to confirm by fetching the likely source article, found via the same
  CDX method on `epicroadrides.com`
  (`https://epicroadrides.com/cycling-blog/camino-de-santiago-bike-tours/`),
  using `render_page.py --mode never`. Returned HTTP 200 but only ~500 bytes of
  content (bot-protection stub) — **actual anchor text and link count on that
  page could not be confirmed.**
- Common Crawl CDX Index API: **zero captures** for any `/testimonials/<slug>/`
  or `/tags/<slug>/` path — checked in the current crawl and four historical
  crawls spanning 2020–2024. Absence of evidence, not evidence of absence: CC is
  a sample, not an exhaustive crawl of every page on every site.
- **Direct HTTP check** (curl, confidence 1.0) against the live production site,
  four sampled restored URLs:
  `/testimonials/5-day-self-guided-bike-tour-silver-coast/`,
  `/testimonials/6-day-cycle-port-to-santiago-de-compostela/`, `/tags/algarve/`,
  `/tags/atlantic-coast/` — **all four returned HTTP 404**, not 301.
- **Git state** (confidence 1.0): `git status -sb` shows the working branch
  `TopBikeToursPortugal` is **3 commits ahead of
  `origin/TopBikeToursPortugal`**, and the redirect-restoration commit
  (`eaf77fe2`) is among the unpushed commits.
- Common Crawl domain graph for `epicroadrides.com` (confidence 0.50), for
  comparison: PageRank rank #1,460,103, harmonic centrality rank #3,284,159 —
  roughly 3x stronger than the target domain on both metrics.

**CARRIED FORWARD from the DataForSEO pull of 2026-08-12** (now returns HTTP 402
and could not be refreshed or spot-checked this session; confidence downgraded
from the skill's normal 1.00 to **0.75** to reflect staleness — 24 hours old but
not independently reverified):

- Domain: 177 referring domains, 3,733 backlinks, domain rank 303,
  `backlinks_spam_score: 2` (low, on DataForSEO's 0–100 scale).
- `referring_links_types`: image 3,169 (85%), anchor 328 (9%), redirect 2.
- `referring_links_semantic_locations`: footer 3,108 (83%), article 201 (5%),
  aside 56, main 22, section 13, header 4.
- `referring_domains_nofollow`: 46 of 177 (26%).
- `referring_links_countries`: blank/unknown 3,285 (88%), US 111, WW 31, PT 13,
  BR 12, GB 11, DE 11, SE 8, FR 6, CO 4.
- Per-page referring-domain counts as supplied in the task brief (homepage 177;
  `/bike-tours-in-portugal/` 1 domain / 76 backlinks / 38 pages, all US, TLD
  `.live`, platform tags `blogs`+`cms`, spam score 1;
  `/bike-tours-porto-portugal/` 3 domains; 3 tour pages with 1 domain each; the
  rest at 0 or untested).
- Of the 21 English tour detail pages: 3 have 1 referring domain each, 9 are
  confirmed at zero, and 9 were never pulled before the credit ran out — though
  the same DataForSEO session's write-up (`DataForSeo/findings-2026-08-12.md`)
  notes all 9 _tested_ peers returned zero, making it unlikely (but unconfirmed)
  that the untested nine differ.
  **`/tours/porto-santiago-compostela-bike-tour-coastal-way/` is confirmed at
  zero.**

**INFERRED (not measured — labelled accordingly):**

- The footer image-link cluster (3,169 links, 83% of the total, footer-located,
  zero anchor text) is very likely a trust-badge / certification / partner-logo
  widget (e.g. a security seal, "as seen on" logo, or directory badge) rather
  than editorial coverage. This is a pattern inference from link type +
  placement, not a confirmed source — the actual badge network's domain(s) are
  unknown without Moz or DataForSEO access.
- The `/bike-tours-in-portugal/` single referring domain (38 pages, `.live` TLD,
  `blogs`+`cms` platform tags, all identical) looks like one blog-network or
  widget publishing the same sitewide link across its own properties, not 38
  independent editorial mentions. Not confirmed — the domain name itself is
  unavailable without Moz/DataForSEO.
- Anchor text beyond the brand name: **cannot be assessed**. No anchor-text API
  is reachable (Moz anchors, DataForSEO anchors, Bing Webmaster all
  unavailable). The Epic Road Rides UTM parameters
  (`utm_term=cycling-the-portuguese-camino`) are campaign tracking metadata
  added by the _destination_ site's own link, not the anchor text used on the
  _source_ page — they should not be read as anchor text evidence.
- Link velocity trend: not assessable under the skill's own methodology
  (DataForSEO-only factor, and DataForSEO is out of credit).

## Findings

### Critical: The 88 restored legacy URLs are not live — "recovered equity" doesn't exist yet

Production still 404s on sampled `/testimonials/<slug>/` and `/tags/<slug>/`
paths as of 2026-08-13 15:30 UTC, despite the restoring commit (`eaf77fe2`)
being present in the local branch. `git status -sb` confirms the branch is 3
commits ahead of `origin/TopBikeToursPortugal` — the fix hasn't been pushed, let
alone deployed. Any external link still pointing at a Gatsby-era testimonial or
tag URL is landing on a 404 today, exactly as it was before this work started.
This has to ship before any of the "recovered equity" premise in the task brief
is true.

### Critical: Zero referring domains on the site's best-converting page

`/tours/porto-santiago-compostela-bike-tour-coastal-way/` — 6.7% conversion, the
strongest page on the site by that metric — is confirmed at 0 referring domains
and 0 backlinks in the 2026-08-12 DataForSEO pull. Across all 21 English tour
detail pages, at most 3 (14%) carry any external link equity at all, each from
the same single source. The commercial engine of the site (individual tour
pages) is running on essentially zero off-page signal.

### High: 85% of the domain's raw backlink count is non-editorial footer image links

3,169 of 3,733 backlinks (85%) are `image`-type links sitting in the footer (83%
of all links by semantic location) — no anchor text, and (inferred, not
confirmed) very likely a trust-badge/certification widget rather than content
endorsement. The 3,733 headline number is misleading on its own: contextual,
text-anchor links (`article`/`main`/`aside`, `anchor` type) are a small fraction
of that total. Referring-domain count (177) is also inflated by this pattern if
the badge appears on many otherwise-unrelated partner sites.

### High: Only one confirmed, relevant editorial link exists, and its trail runs partly through a redirect

Common Crawl independently corroborates Epic Road Rides (epicroadrides.com — a
real cycling travel publication, domain rank materially stronger than the
target's own per CC's graph) as the source of the only external links reaching
product pages. One of its four tracked destinations,
`/tours/porto-to-lisbon-cycling-tour-en/`, now 301s — the link still passes
equity through the redirect, so this is a minor efficiency loss rather than a
break, but it's also the site's _only_ verified real backlink relationship and
its actual anchor text/link count could not be confirmed (the source page
returned a bot-protection stub on fetch). Losing or not maintaining this one
relationship would remove the sole demonstrable editorial signal the site has.

### Medium: The backlink geography doesn't match where the business actually earns visibility

Only 13 of 448 country-tagged referring links (2.9%) are tagged PT, versus 111
US — yet the site's own organic-visibility data
(`DataForSeo/findings-2026-08-12.md`) shows Portugal delivers ~88% of total ETV
(586 vs 61 US, 14 UK). The link-building effort implied by the current profile
is aimed at the wrong market.

### Medium: The one link source that isn't Epic Road Rides looks like a network placement, not organic pickup

`/bike-tours-in-portugal/`'s 76 backlinks come from a single domain publishing
an identical link across 38 of its own pages (`.live` TLD, `blogs`+`cms`
platform tags, all US, spam score 1). Low spam score means it's probably not
toxic, but the pattern (one domain, 38 near- identical placements) reads as a
badge/network placement rather than 38 independent editorial mentions. Worth a
manual check once Moz or DataForSEO access returns — the domain name itself
isn't available at Tier 0.

### Low: Anchor text distribution is entirely unassessed

No anchor-text API is reachable this session (Moz, DataForSEO, Bing Webmaster
all unavailable/exhausted). All that's known is the domain-level _type_ split
(anchor: 328 of 3,733 links, 9%); what those 328 anchors actually say — brand,
generic, exact-match, or otherwise — is unknown. This is the task's third
requirement and it cannot be answered honestly beyond "mostly brand, by
elimination of everything else being image/footer" — that inference is weak and
shouldn't be relied on.

### Low: Common Crawl found no trace of the legacy testimonial/tag URLs, in either direction

Zero CDX captures for any `/testimonials/<slug>/` or `/tags/<slug>/` path across
the current crawl and four historical crawls back to 2020. This means the actual
external link count to those 88 restored URLs is **unknown**, not zero — CC's
crawl is a sample and this is a small, low-authority site. The historical
rationale for restoring them (they were in the old Gatsby sitemap and presumably
earned some inbound links over 2019–2024) is plausible but unverified by any
tool available this session.

## Link targets

Prioritised by (a) commercial value, (b) current absence of any link signal, and
(c) how realistic a near-term link is given the identified opportunity types
(cycling media, Camino resources, Portugal travel press, tourism boards, route
databases).

1. **`/tours/porto-santiago-compostela-bike-tour-coastal-way/`** — the site's
   best-converting page (6.7%) with confirmed zero referring domains; also the
   natural landing page for Camino Português Coastal Way resource sites,
   Komoot/Ride with GPS route listings, and EuroVelo-adjacent coverage. Highest
   priority by a wide margin.
2. **The other three Camino cluster tours**
   (`/tours/french-way-to-santiago-bike-tour/`,
   `/tours/santiago-de-compostela-central-way/`, and the León-start Camino
   Francés tour) — all confirmed or presumed at zero; the Camino de Santiago
   niche has the most obvious, findable link targets of any theme on the site
   (pilgrim forums, Camino guidebook sites, Compostela tourism resources) and
   none of the four Camino tours currently has any.
3. **The six starved day tours**, especially `/tours/electric-bike-tour-porto/`
   and `/tours/douro-valley-full-day-bike-ride/` — they target "bike tour porto"
   (260/mo in PT, €6.90 CPC per the 2026-08-12 pull), the site's single most
   valuable keyword, and have zero external links despite the internal-linking
   fix already shipped. Porto tourism board and city-guide press are realistic
   targets given the day-trip format.
4. **`/tours/bike-tours-douro-valley/`** and its four sibling Douro tours — only
   the hub tour has 1 referring domain; the Douro is a UNESCO wine region with
   an obvious press/tourism- board angle (Rota do Vinho do Porto, wine-tourism
   publications) that isn't being worked.
5. **`/bike-tours-in-portugal/`** — has backlinks, but from one domain only;
   diversifying away from a single source reduces concentration risk on the hub
   page the mega menu's "All tours" link points to.
6. **`/guided-bike-tours-calendar-portugal/`** — already has a confirmed Epic
   Road Rides link; lowest priority for new outreach, but worth a courtesy note
   to Epic Road Rides to repoint their `/tours/porto-to-lisbon-cycling-tour-en/`
   link at the live `/tours/porto-to-lisbon-bike-tour/` URL directly instead of
   through the 301.
7. **`/pt/passeios-bicicleta-porto/`** — explicitly _not_ a link-building
   priority: it already ranks #2–6 in Portugal for the entire "bike tour porto"
   cluster per `DataForSeo/findings-2026-08-12.md`. Listed here only to say it
   should stay off the target list; effort belongs on the pages above that have
   no ranking and no links.

## Not assessed

- **Anchor text distribution** beyond the weak UTM-based inference above — no
  anchor-text API reachable (Moz, DataForSEO, Bing Webmaster all unavailable).
- **Link velocity / trend** — DataForSEO-only capability per the skill's
  methodology; DataForSEO is out of credit.
- **Domain-level quality/spam scoring for the 176 referring domains other than
  epicroadrides.com** — no Moz DA/Spam Score, no DataForSEO domain metrics this
  session.
- **Individual backlink verification** — `verify_backlinks.py` requires a list
  of known source URLs, and no such list exists anywhere in this repo or from
  any available API (only aggregate per-page counts were ever pulled from
  DataForSEO). It could not be run.
- **True inbound-link count to the 88 restored legacy URLs** — Common Crawl
  returned no captures (inconclusive, not zero); the real number is unknown
  until Moz/DataForSEO access returns or a Search Console "Links" export is
  pulled.
- **Whether the Epic Road Rides article still contains the link and what anchor
  text it uses** — the source page could not be fetched past a ~500-byte
  bot-protection stub.
- **Manual-action / negative-SEO risk** — no Search Console manual-actions data
  was pulled this session.
