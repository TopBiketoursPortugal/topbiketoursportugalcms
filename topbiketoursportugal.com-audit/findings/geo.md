## Score: 58/100

Dimension breakdown (weighted):

- Citability (25%): 55/100
- Structural Readability (20%): 60/100
- Multi-Modal Content (15%): 50/100 (not fully assessed — see below)
- Authority & Brand Signals (20%): 40/100 (partly inferred from GSC
  brand-position decline; entity checks not run)
- Technical Accessibility (20%): 85/100

## What works

- **AI crawler access is genuinely unobstructed.** Live production `robots.txt`
  (`https://topbiketoursportugal.com/robots.txt`) is `User-Agent: *` /
  `Disallow:` with a sitemap reference — no disallow rules for GPTBot,
  OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, or Bingbot.
  Confirmed dist output matches the live file byte-for-byte.
- **No cloaking/JS-gating.** `curl -A "GPTBot" .../bike-tours-in-portugal/` and
  a default-UA fetch of the same URL returned byte-identical HTML (368,352
  bytes, `diff` clean). The site is static/SSR (Astro build), so crawlers that
  don't execute JavaScript see the same content a browser does.
- **`/llms.txt` is present and reasonably well-formed** (dist and live match):
  grouped links to tours, day tours, calendar, blog, about, testimonials,
  regions, contact info. Useful as a crawl map for LLM agents that consult it,
  though it carries no weight with Google (AI Overviews) — don't over-credit it.
- **At least one tour page has excellent passage-level citability.**
  `/tours/bike-tours-douro-valley/` renders (in static HTML, no JS needed) a
  day-by-day itinerary as self-contained, numeric, extractable lines, e.g. _"Day
  1: Porto – Pinhão (110 km, van transfer)"_, _"Day 6: Marialva – Penedono (28
  km, 57 km or 73 km)"_, plus a "Route Description" giving exact elevation
  (7,500 m cumulative ascent) and surface (100% paved). This is exactly the kind
  of self-contained, specific answer block AI Overviews/ChatGPT/Perplexity
  prefer to quote.
- **FAQ content on tour pages is direct-answer formatted and already in static
  HTML**, e.g. Douro Valley tour FAQ: _"Are carbon road bikes available for
  rent? Yes. You can rent a carbon road bike on this tour for around €270
  extra..."_ and _"What level of cycling fitness is recommended? ...moderate to
  hard, with steep climbs and around 4,400 m of total ascent..."_ — specific
  numbers, self-contained, no context needed.
- **Product/Offer schema with real pricing is present** on tour pages
  (`@type: Product`, `Offer`, `AggregateRating`), giving structured price
  signals machines can parse without scraping prose.
- **Blog posts carry author and date signals**: `bike-tours-douro-valley` blog
  article ships `BlogPosting` JSON-LD with `datePublished` and a `Person` author
  (`Sérgio Marques`), which is a genuine E-E-A-T/authority signal AI systems
  weight.

## Findings

### [High] The flagship commercial page buries its only truly citable answer 86% down the document, under no matching heading

Evidence: `/bike-tours-in-portugal/` (source:
`src/content/pages/bike-hollidays.mdx`) is the exact page named in the brief —
ranking position 3.8–9.2 for six "best bike tours portugal" variants, ~900
impressions, zero clicks. In the built HTML
(`dist/bike-tours-in-portugal/index.html`, 265,582 bytes total) the only
self-contained, structured answer block on the page — the difficulty/distance
classification (`Easy: ... daily distances up to 50 km`,
`Moderate: ... climbs up to 40%`, etc., correctly marked up as
`<ul><li><strong>`) — starts at byte offset 228,731, i.e. ~86% of the way
through the document. It sits behind roughly 20 `<h4>` tour-card headings and
two full tour-listing grids, with no dedicated question-style `<h2>`/`<h3>`
(e.g. "How difficult are Portugal bike tours?") positioned directly above it to
signal relevance for that query. A crawler or answer engine that samples the
first N tokens, or that weights passages by proximity to a matching heading, is
unlikely to ever reach or select this block — which plausibly explains "ranked
but zero clicks": Google/AI systems may be citing generic tour-card text instead
of a real differentiated answer. Fix: Add a condensed 40–80 word direct-answer
block near the top of the page (immediately under the H1 or a new "How hard are
our Portugal bike tours?" H2), restating the 5-tier classification succinctly;
keep the full version where it is. This is a content-ordering change only, low
effort, no new content needed — it already exists on the page.

### [Medium] No FAQPage structured data despite strong on-page FAQ content

Evidence: `dist/tours/bike-tours-douro-valley/index.html` has an `<h2>Faq</h2>`
section with 8 direct Q&A pairs already rendered in static HTML (grep confirms
the text is present, not JS-injected), but `grep -c "FAQPage"` on the same file
returns `0`. JSON-LD on the page covers `Product`, `Offer`, `AggregateRating`,
`LocalBusiness`, `BreadcrumbList`, `GeoCoordinates` — no `FAQPage`. Fix: Wrap
the existing FAQ markup in `FAQPage`/`Question`/`Answer` JSON-LD on all tour
pages. This is metadata only — the answer text already exists and doesn't need
rewriting. Confirm this pattern repeats across the other 24 tour pages in
`dist/tours/`.

### [Medium] Typos and internally inconsistent copy on the page that most needs authority signals

Evidence: `src/content/pages/bike-hollidays.mdx` (source for
`/bike-tours-in-portugal/`) contains "Top Biketours Portugal, Unipessoal Lda is
**iregistered** in Tourism of Portugal" and "In **Guidec cyling** tours." on the
same page that's meant to carry the RNAAT registration number as a
trust/authority signal. Fix: Proofread this page specifically; the RNAAT number
and legal-entity name are exactly the kind of factual/authority detail AI
systems and users cross-check, so typos there are disproportionately damaging.

### [Medium] Tour-tag content mismatch: "Guided Bike Tours in Portugal" tag page describes wine tours, not guided tours

Evidence: `src/content/tour-tags/guided-bike-tours-in-portugal.mdx` has
`title: Guided Bike Tours in Portugal`, `path: guided`, but both
`content_blocks` and `content_blocks_after` text bodies are entirely about wine
cycling in the Douro Valley, Alentejo, and Vinho Verde ("Experience Portugal's
most iconic wine regions...", "Discover Portugal's wine heritage...") with no
mention of what distinguishes a _guided_ tour. This page renders via
`src/pages/[...language]/tours/tags/[tag].astro`. Fix: Verify which live URL
this tag resolves to and whether it's indexable; either rewrite the prose to
actually answer "what is a guided bike tour in Portugal" (logistics: guide,
support van, meals — content for this already exists verbatim on
`bike-hollidays.mdx`, could be reused) or reclassify/merge with the wine tag if
this was a copy-paste mistake.

### [Low] Tours use `Product`/`Offer` schema rather than the more semantically precise `TouristTrip`

Evidence: JSON-LD `@type` list on
`dist/tours/bike-tours-douro-valley/index.html` includes `Product`, `Offer`,
`AggregateRating` — functionally fine for price-rich snippets, but `TouristTrip`
(with `itinerary`, `subTrip` for each day) is the schema.org type built
specifically for multi-day guided trips and would let an itinerary already
written in prose (Day 1, Day 2...) be marked up as structured `subTrip` entries.
Fix: Not urgent given `Product` already carries pricing; consider layering
`TouristTrip` alongside `Product` if time allows, prioritized behind the FAQPage
fix above.

### [Low] No RSL 1.0 licensing signal

Evidence: `https://topbiketoursportugal.com/rsl.xml` returns 404; no RSL license
reference found anywhere in `public/` or `dist/`. Fix: Low priority — RSL
adoption among AI crawlers is still early and the brief itself notes
llms.txt/RSL are secondary. Note only; do not prioritize over the citability and
schema fixes above.

## Not assessed

- **Multi-modal content**: image `alt` text quality, video presence/transcripts,
  and image sitemap coverage were not checked — the Multi-Modal score above
  (50/100) is an unverified placeholder, not a measured result.
- **Off-site brand/entity signals**: Wikipedia, Reddit, YouTube, LinkedIn
  presence and mention volume were not checked live. The brief notes brand-term
  position dropped 1.4 → 4.9 YoY; this is taken as given context, not
  independently re-verified here, and the Authority score partly reflects that
  unverified assumption.
- **Live platform visibility testing**: no live queries were run against
  ChatGPT, Perplexity, Google AI Overviews, or Bing Copilot (DataForSEO
  `ai_optimization_chat_gpt_scraper` / `ai_opt_llm_ment_search` were not
  invoked). Platform-specific scores were not produced.
- **Coverage beyond two sampled pages**: `/bike-tours-in-portugal/` and
  `/tours/bike-tours-douro-valley/` were read in depth as representative
  examples; the remaining ~24 tour pages, day-tour pages, region pages, and the
  full blog archive were not individually audited for the same buried-answer and
  FAQPage-schema patterns, though the flagship-page finding and the FAQPage gap
  should be assumed to generalize until checked.
- **Portuguese-language (`/pt/`) pages**: not reviewed for parity on any of the
  above.
- **Page weight / crawl efficiency**: `/bike-tours-in-portugal/` is a 265KB HTML
  document; whether this affects crawl budget or truncation behavior for AI
  crawlers specifically was not tested.
- **Sitemap freshness and `lastmod` accuracy**: not checked.
