# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — international multi-day holiday cyclists.** English-speaking riders
abroad researching a 7–16 day cycling holiday in Portugal, typically months in
advance. They are choosing a trip, not a page: they compare operators, read
itineraries day by day, check difficulty against their own fitness, and want to
know what is actually included before they commit several thousand euros and a
week of annual leave. Decisions are rarely made in one sitting and often involve
a partner or a small group of riding friends.

**Secondary — visitors already in Porto.** People in the city looking for a
half- or full-day guided ride, deciding days or hours ahead. Same brand, very
different urgency: short consideration, mobile-first, low price, no logistics to
resolve.

Portuguese-speaking riders are served by a full `/pt/` locale, but were not
confirmed as a distinct audience with its own demand. German (`/de/`), Spanish
(`/es/`), French (`/fr/`) and Dutch (`/nl/`) locales were added in August 2026
for the highest per-capita cycling-holiday spenders among the markets already
reaching the site (DE/CH/AT, NL/BE, FR + Québec, ES); pages, taxonomies and
tours are translated, blog posts are unpublished stubs awaiting translation. B2B
agencies and resellers were not selected as an audience.

## Product Purpose

Top Bike Tours Portugal designs and operates cycling holidays across Portugal
and the north of the Iberian Peninsula — guided and self-guided, hotel-to-hotel,
with luggage transfers, pre-booked accommodation, GPS navigation and support on
the road. The site's job is to make a stranger confident enough in a specific
route to start a conversation about riding it.

Success is a visitor who either sends a tour inquiry through the package-tour
form or completes a booking through WeTravel. Both are live funnels and both
count; the form carries the multi-day holidays where the trip gets shaped in
email, and WeTravel carries the transactions a visitor is ready to close
themselves.

## Positioning

**Every route is ridden and tested by the people who sell it.** Road surface,
traffic patterns, elevation, prevailing wind and seasonal conditions are known
first-hand and the itineraries are revised from rider feedback and guide
reports. A reseller or an aggregator can list a Portuguese cycling week; it
cannot truthfully say it has ridden the road.

## Operating Context

- **Long, fragmented research.** The multi-day audience returns across sessions
  and devices, compares against other operators, and reads deeply — itineraries,
  inclusions, difficulty, reviews — before contacting anyone.
- **Two conversion paths in parallel.** Formspree inquiry forms (`packageTours`,
  `contact`) and embedded WeTravel booking buttons coexist on tour pages.
  WhatsApp, email (`reservations@topbiketoursportugal.com`) and phone
  `(+351) 915 316 999` are published contact routes.
- **Content is edited in CloudCannon by non-technical staff.** Pages are
  assembled from `page-sections/*` component blocks with editor-facing schemas
  and inputs. Any component built here must survive being configured, reordered,
  duplicated and left half-filled by an editor who cannot read the code.
- **Two locales in lockstep.** Every page, tour, post and team bio exists in EN
  and PT and is routed under `[...language]`. Copy and layout decisions land
  twice.
- **Physical base in Porto.** Rua Dom João IV 385 nº1, 4000-303 Porto — 500 m
  from Bolhão Market. Guided departures run from here.

## Capabilities and Constraints

- **Stack:** Astro 7 static output, MDX content collections with Zod schemas,
  Tailwind 4, React islands, Pagefind search, deployed on Netlify. `pnpm build`
  runs `astro build` then two in-repo SEO gates (`tools/seo/check-urls.mjs`,
  `tools/seo/audit-dist.mjs`). Jampack runs after Astro in the deploy path and
  rewrites image loading attributes and inlines CSS, so `dist/` is not what
  ships.
- **CloudCannon is the CMS.** `cloudcannon.config.yml` plus per-component
  `*.cloudcannon.inputs.yml` / `*.cloudcannon.structure-value.yml` files define
  what editors can do. New components need their editor schema or they do not
  exist for the people who run the site.
- **Content inventory (confirmed):** 21 tours, 6 tour regions, 3 rider levels, 5
  bike categories, 9 bikes, 12 tour tags, 135 blog posts, 12 blog tags, 7 team
  members, 14 pages — each mirrored in PT except testimonials (168 EN, 0 PT).
- **Tour data model:** per-day itinerary with lat/lng, difficulty 1–5, rider
  levels, bike categories, group size min/max, and priced packages in EUR with
  optional promo and "best value" flags. All 21 tours carry real prices.
- **Taxonomy and terminology, as the product uses them:** _guided_ vs
  _self-guided_; _day tours_ (Porto, hours) vs _bike tours / cycling holidays_
  (7–16 days, hotel-to-hotel); rider levels; bike types — touring, road, gravel,
  mountain, e-bike; regions — Douro, North of Portugal, Oeste, Algarve, Lisbon &
  Tagus Valley, Santiago de Compostela.
- **Third-party runtime dependencies:** Google Tag Manager, Google Analytics,
  Microsoft Clarity, WeTravel, Formspree, and a cookie-consent layer. The CSP in
  `netlify.toml` is deliberately report-only because a blocking policy would
  risk taking the booking flow down.
- **URL history is load-bearing.** `data/url-history.json` and the `seo:check`
  gate exist to keep historical URLs alive. Route or slug changes are an SEO
  decision, not a design one.

## Brand Commitments

- **Name:** Top Bike Tours Portugal. Founded 2013 as _Fold n' Visit_; renamed at
  the end of 2017. The old name persists in legacy social handles (`@FoldnVisit`
  on X, `author_twitter_handle` in page frontmatter) — factual history, not a
  current identity.
- **Incumbent visual system** (documented here as fact, not as a design brief):
  theme color `#296a3f`; Figtree Variable for body, Bricolage Grotesque Variable
  for headings, Caveat Variable as an accent face; a token layer under
  `src/styles/starter/` with light and dark themes bridged in
  `src/styles/starter/bridge.css`; `siteicon.png` as the app/brand mark.
- Team bios are written by each team member themselves and are labeled as such
  on the About page.

## Evidence on Hand

- **168 testimonials**, each with the TripAdvisor review URL it came from, a 1–5
  score, author first name and country, date, and in many cases the specific
  tour it refers to. This is verifiable third-party proof and should be treated
  as the strongest asset on the site.
- **Public TripAdvisor listing** (`Attraction_Review-g189180-d4105907`) and
  active Facebook and Instagram accounts.
- **Real prices**, in EUR, per package, on all 21 tours.
- **Itineraries with geographic coordinates** per day — real, mappable routes
  rather than prose summaries.
- **7 named team members** with self-written bios and photography.
- **First-party photography** in `src/assets/` covering routes, regions and
  rides; one YouTube film (`zO2uuYBtgt4`) on the About page.
- **Not on hand — do not fabricate:** awards, certifications, accreditations,
  guest counts, "trusted by" figures, partner logos, press coverage, or any
  review not traceable to a `reviewSource` URL already in the repo.

## Product Principles

1. **The route is the product.** Confidence comes from itinerary specifics —
   distance, elevation, surface, where you sleep, what happens if it rains — not
   from adjectives about adventure. Surface the concrete before the evocative.
2. **Two clocks, one brand.** A holiday buyer needs depth across repeat visits;
   a day-tour buyer needs a decision in ninety seconds on a phone. Never let one
   audience's pacing set the other's surface.
3. **Earned proof over asserted quality.** With 168 sourced reviews and
   first-hand route testing available, any claim the site makes should be
   traceable to something real in the repo.
4. **Both funnels stay open.** Inquiry and self-service checkout serve different
   readiness levels. Design must not quietly privilege one into invisibility.
5. **Editors are users too.** Every component ships with a CloudCannon schema
   and degrades gracefully when a field is left empty. A design that only works
   when perfectly configured will not survive contact with the CMS.
6. **Bilingual by construction.** EN and PT are equal citizens; copy length,
   layout and components must hold up in both.

## Accessibility & Inclusion

No product-specific standard has been established with the user — recorded as an
open decision rather than assumed. What exists today is baseline:
`prefers-reduced-motion` guards and `:focus-visible` styling in
`src/styles/global.css`, ARIA labeling in navigation and breadcrumbs, and a
light/dark theme system. Worth noting for future work that the primary audience
skews toward older leisure cyclists, which makes text size, contrast and
touch-target generosity a business concern independent of any compliance target.
