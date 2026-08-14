## Score: 34/100

## What works

- Real operator with named, photographed guides (`src/content/team/*.mdx` — João
  Natal, Felipe Trielli, Sérgio Marques, Miguel Babo, Pedro Oliveira, Telmo
  Novais, Diana Fernandes) with first-person-flavored bios (languages spoken,
  hometown, hobbies) — a genuine experience/expertise signal most competitor
  blogs lack.
- ~60 blog posts carry a named, credentialed byline: "Written by Sérgio Marques,
  Founder & Route Designer, Top Bike Tours Portugal" (`src/content/blog/*.mdx`,
  `author:` field) — this is correct E-E-A-T practice when it's not undermined
  by the issues below.
- Tour pages (`src/content/tours/*.mdx`) are itinerary-rich with day-by-day
  descriptions, named hotels, and outbound links (e.g.
  `alentejo-wine-country-and-castles.mdx` — 8-day itinerary, ~2,349 words of
  structured content, real property names like Torre de Palma, M'AR de Ar). This
  is first-hand operational detail, not generic AI filler.
- 42 tours (21 EN / 21 PT) and 135/135 EN/PT blog parity show real content
  investment, not a neglected blog bolted onto a small site.

## Findings

### Critical: The majority of the EN blog corpus is stub-to-thin content published as full articles

Word counts (frontmatter-stripped body, `src/content/blog/*.mdx`, n=135):

- 13 posts under 300 words, 17 under 500, 62 under 800, 102 under 1,000, and
  only 5 of 135 clear the 1,500-word blog-post floor.
- Nearly-empty stubs padded with real URLs and full templates (title, SEO
  fields, images) despite almost no body copy:
  - `divulgacao-de-apoio-do-iefp.mdx` — 6 words
  - `partners.mdx` — 21 words
  - `bike-tours-portugal-gustavo-cabral-pictures-and-movies.mdx` — 28 words
  - `website-link-changed-to-www-topbiketoursportugal-com.mdx` — 54 words
  - `worlds-leading-destination-2019.mdx` — 81 words
  - `bike-tours-portugal-friends-letters.mdx` — 97 words
  - `equipa-juma.mdx` — 104 words
  - `carmen-paz-e-fernando.mdx` — 109 words
  - `mark-mander-and-friends.mdx` — 140 words
  - `great-reviews-about-our-bike-tours-in-portugal.mdx` — 146 words
  - `benefits-of-your-first-bike-tour.mdx` — 168 words
  - `save-on-airport-parking-in-the-uk.mdx` — 218 words (off-topic entirely —
    see Medium finding below)
  - `vouchers-para-startups-novos-produtos-verdes-e-digitais.mdx` — 273 words
  - `darren-alff-article-about-our-bike-tour-the-way-of-saint-james.mdx` — 316
    words
- Fix: either 301-redirect/noindex the sub-300-word stubs into the posts or
  team/testimonials pages they duplicate, or expand them with real
  itinerary/guide detail. Do not leave 13 near-empty URLs indexed and competing
  with the site's own better content.

### High: Duplicate/near-duplicate content clusters on the four topics named in the brief

Google is very likely folding several of these into each other or picking the
wrong canonical, which matches the "grew vs declined" split in the traffic data
(the operator's own commercial tour pages are being cannibalized by
near-duplicate blog posts on the same destinations).

**Camino de Santiago / Porto-to-Santiago cluster (15 posts, same core topic —
cycling the Portuguese Camino):**
`article-porto-to-santiago-de-compostela-darren-alff.mdx`,
`Bob-review-the-way-of-st-james-starting-in-porto.mdx`,
`Camino-de-santiago-starting-in-porto-city-brazil-couple.mdx`,
`biking-from-porto-to-santiago-guide.mdx`,
`cycling-camino-de-santiago-french-way.mdx`,
`cycling-portuguese-camino-porto-to-santiago.mdx`,
`cycling-the-portuguese-camino-vs-walking-it.mdx`,
`cycling-through-history-camino-de-santiago-top-bike-tours.mdx`,
`family-porto-to-santiago-by-bike.mdx`, `guide-to-see-and-do-in-santiago.mdx`,
`gustavo-e-nicole-way-of-saint-james.mdx`,
`Overview-of-the-Camino-de-Santiago.mdx`,
`porto-to-santiago-de-compostela-mark-mander-group.mdx`,
`porto-to-santiago-de-compostela-tour-5-day-coastal-e-bike-itinerary.mdx`,
`Portuguese-Camino-vs-French-Camino.mdx`,
`sacred-trails-cycling-santiago-de-compostela-top-bike-tours.mdx`,
`scenic-route-porto-to-santiago-compostela.mdx`,
`where-to-stay-on-the-porto-to-santiago-de-compostela-bike-tour.mdx`

- Fix: keep one canonical pillar
  (`cycling-portuguese-camino-porto-to-santiago.mdx`, the most complete draft)
  plus the genuinely distinct customer-story posts (Mark Mander, Carmen Paz,
  Gustavo e Nicole, Bob's review — these should live as testimonials, not blog
  posts competing for the same keyword). Merge/redirect the remaining
  "guide/overview/scenic route/what to expect" posts into the pillar. This
  directly serves the commercial tour it should be funneling to:
  `tours/porto-santiago-compostela-bike-tour-coastal-way`,
  `tours/santiago-de-compostela-central-way`,
  `tours/french-way-to-santiago-bike-tour`.

**Douro Valley cluster (4 near-identical "Douro Valley cycling guide" posts):**
`Cycling-tours-in-the-Douro-Valley.mdx`, `cycling-douro-valley-guide.mdx`,
`discover-the-wonders-of-portugal-with-bike-rides-through-the-douro-valley.mdx`,
`douro-valley-bike-tour.mdx`

- Fix: merge into one pillar (`cycling-douro-valley-guide.mdx` has the best
  working title/H1 structure) and 301 the other three; fold
  `Where-you-Stay-on-a-Douro-Valley-Bike-Tour.mdx` and
  `What-to-Expect-on-Douro-Valley-Bike-Tour.mdx` in as H2 sections of the pillar
  rather than standalone thin pages.

**Alentejo cluster:** `Best-Time-to-Cycle-in-Alentejo.mdx`,
`cycling-alentejo-the-complete-bike-tour-guide.mdx`,
`what-to-expect-ona-an-alentejo-bike-tour.mdx`,
`where-you-stay-on-an-alentejo-bike-tour.mdx`, plus
`portugal-wine-bike-tours-douro-alentejo.mdx` overlapping both this and the
Douro cluster

- Fix: `cycling-alentejo-the-complete-bike-tour-guide.mdx` as pillar; merge the
  "best time," "what to expect," and "where you stay" posts in as sections; keep
  the Douro/Alentejo wine comparison separate since it's a genuinely different
  (comparison) intent.

**Porto–Lisbon cluster (7 posts on the same tour):**
`7-reasons-bike-tour-porto-lisbon.mdx`,
`Best-Foods-on-a-Porto-to-Lisbon-cycling-tour-week.mdx`,
`best-porto-to-lisbon-cycling-holiday.mdx` (3,176 words — the strongest draft),
`cycling-porto-lisbon-travel-guide.mdx`,
`cycling-porto-to-lisbon-cycling-tour-guide.mdx`,
`porto-to-lisbon-by-bicycle-a-premium-coastal-adventure-at-atlantic-peace.mdx`,
`where-to-stay-on-the-porto-to-lisbon-cycling-tour.mdx`

- `cycling-porto-lisbon-travel-guide.mdx` and
  `cycling-porto-to-lisbon-cycling-tour-guide.mdx` are near-identical titles
  competing for the identical query — this pair alone should be merged first.
- Fix: consolidate onto `best-porto-to-lisbon-cycling-holiday.mdx` (already the
  deepest and highest-traffic draft per the impressions data), redirect the
  rest, and fold "best foods" / "where to stay" in as sections.

### High: "Where you stay" and "What to expect" are templated across regions — a repetitive-structure marker the Sept 2025 QRG flags for low-quality/AI-pattern content

`Where-you-Stay-on-a-Douro-Valley-Bike-Tour.mdx`,
`where-you-stay-on-an-alentejo-bike-tour.mdx`,
`Where-You-Stay-on-an-Algarve-Bike-Tour.mdx`,
`Where-You-Stay-on-a-North-of-Portugal-Bike-Tour.mdx`,
`Where-You-Stay-on-the-Portugal-Atlantic-Coast-Bike-Tour.mdx`,
`where-to-stay-on-the-porto-to-lisbon-cycling-tour.mdx`,
`where-to-stay-on-the-porto-to-santiago-de-compostela-bike-tour.mdx` (7 posts),
and separately
`What-to-Expect-on-a-North-of-Portugal-&-Minho-Cycling-Holiday.mdx`,
`What-to-Expect-on-a-Portugal-Atlantic-Coast-Cycling-Holiday.mdx`,
`What-to-Expect-on-Douro-Valley-Bike-Tour.mdx`,
`what-to-expect-ona-an-alentejo-bike-tour.mdx` (4 posts).

- Same problem with the "Complete Guide" bike-type series
  (`E‑Bike-in-Portugal.mdx`, `Road-Bike-in-Portugal.mdx`,
  `Gravel-Bike-in-Portugal.mdx`, `Mountain-Bike-in-Portugal.mdx`,
  `Touring-Bike-in-Portugal.mdx`) — programmatic-pattern content; see
  `seo-programmatic` sub-skill for the template-quality standard these should be
  held to.
- Fix: fold each "where you stay" / "what to expect" post into its parent tour
  page (`src/content/tours/*.mdx` already has this detail, e.g. hotel names in
  `alentejo-wine-country-and-castles.mdx`) as an FAQ/accordion section instead
  of a standalone thin page duplicating the tour's own itinerary.

### High: Two of the four named low-CTR pages are topically mismatched to the business, not a title/snippet problem

- `blog/uniting-teams-the-5-best-team-building-activities/`
  (`src/content/blog/uniting-teams-the-5-best-team-building-activities.mdx`, 502
  words): title "Uniting Teams: The 5 Best Team Building Activities" is generic
  corporate content unrelated to Portugal cycling tours. 3,208 impressions / 1
  click is not a snippet problem — Google is surfacing it for a query with no
  commercial relevance to this site. Fix: either reposition explicitly as
  "corporate cycling team-building tours in Portugal" (a real Top Bike Tours
  Portugal service) with a strong CTA to a bookable product, or deindex it — as
  written it can't convert.
- `blog/mountain-biking-in-portugal-guide/`
  (`src/content/blog/Mountain-Bike-in-Portugal.mdx` is the bike-type guide; the
  actual matching file is `mountain-biking-in-portugal-guide.mdx`, 1,691 words):
  title "Mountain Biking in Portugal Guide: Top Trails, Tips and Tours" and meta
  description are reasonably matched to informational MTB-trail intent, yet
  takes 12,151 of 12,384 impressions from "best mountain biking trails" at
  position 8.6 with 0 clicks. This is a page-two-of-results position problem
  compounding an intent mismatch (searcher wants a trail directory, page sells
  guided tours) — no plausible title/meta rewrite fixes a position-8.6 CTR at
  scale. Fix: this keyword is not worth chasing; the page should be re-targeted
  to a query the business can actually convert on ("Portugal MTB guided tours")
  rather than optimized further for "best mountain biking trails."
- `blog/portugal-cycling-tours-all-you-need-to-know/`
  (`src/content/blog/portugal-cycling-tours-all-you-need-to-know.mdx`, 4,602
  words — the single longest post on the site) sits at average position 66.5
  (page 6-7). At that position, CTR is near-zero regardless of title/meta
  quality — the page is not being shown, so this is a ranking/relevance problem
  (likely diluted by trying to cover too broad a topic and cannibalized by the
  duplicate clusters above), not a snippet problem.
- `blog/cycling-for-fitness-stamina-and-strength/`
  (`src/content/blog/cycling-for-fitness-how-to-improve-your-stamina-and-strength.mdx`,
  798 words, position 9.7, 5 clicks from 6,391 impressions): title "Cycling for
  Fitness: How to Improve Your Stamina and Strength" pulls generic
  health/fitness search traffic that has no tour-booking intent — same
  intent-mismatch pattern as the team-building and MTB-guide pages. At 798 words
  it is also too thin to compete with dedicated fitness-authority sites for the
  traffic it is attracting anyway.

### High: Author attribution is inconsistent and mostly generic, undermining the expertise signal that does exist

- 55 of 135 EN posts (41%) are attributed to "Top Bike Tours Portugal Editorial
  Team" — a faceless byline with no linked profile, credentials, or bio anywhere
  on the site.
- 3 posts use `author: Admin`.
- 1 post has a corrupted byline: `author: op Bike Tours Portugal Editorial Team`
  (truncated "Top") — appears to be a find/replace error.
- The ~60 posts correctly attributed to "Sérgio Marques, Founder & Route
  Designer, Top Bike Tours Portugal" have at least 20 near-duplicate string
  variants of the same byline (inconsistent spacing/commas: "Sérgio Marques,
  Founder..." vs "Sérgio Marques ,Founder..."), suggesting copy-paste across
  posts rather than a maintained author field — cosmetically minor but confirms
  these bylines were bulk-applied, not authored per-post.
- Critically, none of the author bylines checked link to
  `src/content/team/*.mdx` (Sérgio Marques does not have his own `team/` page —
  the team roster is guides only: João Natal, Felipe Trielli, Miguel Babo, Pedro
  Oliveira, Telmo Novais, Diana Fernandes; no founder profile). A byline
  claiming "Founder & Route Designer" with no corresponding author bio page is a
  weaker trust signal than it should be.
- Fix: add a founder/author bio page for Sérgio Marques and hyperlink every
  "Written by Sérgio Marques..." byline to it; replace "Editorial Team"/"Admin"
  bylines on posts with real operational content (itineraries, safety, packing)
  with the guide or founder who actually has the expertise, since those topics
  are exactly where first-hand credentials matter most for E-E-A-T.

### Medium: Off-topic legacy posts dilute topical authority and sit in the main blog alongside tour content

`save-on-airport-parking-in-the-uk.mdx` (218 words, UK airport parking — zero
relevance to Portugal cycling), `3-tips-for-solar-eclipse.mdx` (Spain solar
eclipse viewing), `vouchers-para-startups-novos-produtos-verdes-e-digitais.mdx`
(government startup vouchers), `divulgacao-de-apoio-do-iefp.mdx` (IEFP subsidy
disclosure), `covid-19-requirements-to-comply-with.mdx`. These read as old
company-news/compliance posts rather than customer-facing content and dilute the
blog's topical focus on cycling/Portugal.

- Fix: move to a "company news" archive outside the primary `/blog/` taxonomy,
  or noindex.

### Medium: Tour page thin outlier

`src/content/tours/mountain-bike-tour-porto.mdx` (path
`tours/mountain-bike-tours-porto`) — 245 words, the only tour page well under
the rest of the tour catalog (next-lowest is 628 words; most run 2,000-4,300).
It's a half-day tour so some brevity is expected, but at 245 words it lacks the
day-by-day/what's-included depth that makes every other tour page credible.

- Fix: bring up to parity with
  `e-bike-porto-downtown-and-sightseeing-bike-tour.mdx` (628 words) at minimum —
  add route detail, difficulty, what's included, meeting point.

### Medium: Guided vs. self-guided topic fragmented across 8 posts (bonus cluster beyond the four requested)

`guided-bicycle-tour.mdx`, `Guided-Bike-Tours-in-Portugal.mdx`,
`guided-bike-tours-portugal-guide.mdx`,
`guided-vs-self-guided-bike-tours-portugal.mdx`,
`Self-Guided-Bike-Tours-in-Portugal.mdx`,
`Self-Guided-vs-Guided-Bike-Tours-in-Portugal.mdx`,
`unique-experiences-with-guided-bike-tours.mdx`,
`style-of-top-guided-bike-tours-in-portugal.mdx`

- Fix: consolidate to two pillars max (Guided vs Self-Guided comparison; Guided
  Bike Tours overview) and redirect the rest.

### Low: PT parity means every EN duplication problem is doubled

135 PT posts mirror the 135 EN posts 1:1 (`src/content/blog/pt/`). None of the
PT files were checked individually in this pass, but since consolidation targets
are named by shared `path`/topic, any EN merge should be mirrored in
`src/content/blog/pt/` in the same commit to avoid re-diverging the two language
trees.

## Not assessed

- Live rendered HTML: heading hierarchy, direct-answer placement near the top,
  and question-shaped H2/H3s were not checked against the built `dist/` output —
  AI citation readiness (item 5) is unassessed beyond the one source file
  inspected (`mountain-biking-in-portugal-guide.mdx`, which does use bolded
  H2/H3 questions like "Why Portugal is a Top Destination for Mountain Biking").
- Actual rendered `<title>`/`<meta description>` tags in `dist/` were not diffed
  against `src` frontmatter `seo.page_title`/`seo.page_description` for the four
  named low-CTR pages beyond `mountain-biking-in-portugal-guide.mdx` — no live
  fetch was performed.
- `dist/about-us-biking-travel`, `dist/contacts`, `dist/faqs` were not opened —
  trustworthiness signals (business address, phone, registration/licensing,
  security/HTTPS, privacy policy content quality) are unverified.
- Structured data / schema markup presence (Article, LocalBusiness, TouristTrip)
  was not checked.
- Content freshness/update signals (`date:` field recency vs. last substantive
  edit) were not analyzed across the corpus.
- Readability metrics (Flesch-Kincaid etc.) were not computed.
- PT-language content (`src/content/blog/pt/`, `src/content/tours/pt/`) was
  inventoried for parity only, not independently quality-reviewed.
- Full text-similarity scoring between clustered posts (beyond title/topic
  overlap) was not run — cluster groupings above are based on title and stated
  topic, not a diff.
