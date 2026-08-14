# Local SEO Audit — topbiketoursportugal.com

## Score: 55/100

| Dimension                      | Weight | Est. score | Weighted    |
| ------------------------------ | ------ | ---------- | ----------- |
| GBP Signals                    | 25%    | 55/100     | 13.75       |
| Reviews & Reputation           | 20%    | 60/100     | 12.0        |
| Local On-Page SEO              | 20%    | 35/100     | 7.0         |
| NAP Consistency & Citations    | 15%    | 65/100     | 9.75        |
| Local Schema Markup            | 10%    | 65/100     | 6.5         |
| Local Link & Authority Signals | 10%    | 55/100     | 5.5         |
| **Total**                      |        |            | **~55/100** |

Business type: **Hybrid** — visible street address + directions link
(brick-and-mortar signals) combined with multi-region/cross-border tour delivery
into Spain (SAB-style service area). No `areaServed` currently declared in
schema despite this.

Industry vertical: **Home/Local Services adjacent — Tour Operator / Travel**.
Not a perfect fit for any of the five reference verticals
(restaurant/healthcare/legal/home-services/real-estate/automotive); closest is a
travel & activities business.

---

## What works

- **LocalBusiness JSON-LD is present sitewide**
  (`src/components/schema/organization-schema.astro`, injected via
  `Layout.astro` on every page) with `name`, `address` (full `PostalAddress`),
  `geo` (`GeoCoordinates` at 6 decimal precision, exceeding the 5-decimal
  minimum), `openingHoursSpecification`, `telephone`, `url`, `priceRange`, and
  `sameAs` (Facebook, Instagram, TripAdvisor, Twitter). Most required and
  recommended properties are covered.
- **Individual tour pages carry real, computed review data** — `tour-page.astro`
  calls `getAggregatedReviews()` on actual review content and passes true
  `ratingAverage`/`ratingCount` into `TourProductSchema`
  (`tour-product-schema.astro`), which emits a genuine `AggregateRating` (not
  padded/fake) per tour Product.
- **Site NAP is internally consistent between visible HTML and schema** for the
  English locale — the live homepage shows "Rua Dom João IV 385, nº1, 4000-303,
  Oporto, Portugal" and "(+351) 915 316 999", identical to what
  `organization-schema.astro` emits (both sourced from `data/contact.json`).
- **A confirmed, strong third-party citation exists**: TripAdvisor lists "Top
  Bike Tours Portugal," Porto, Portugal, rated 4.8/5 from 448 reviews, ranked
  #29/406 Outdoor Activities in Porto — solid external reputation signal
  independent of the site itself.
- **GBP is a live, materially productive channel** (per campaign context:
  ~32,767 impressions / 303 clicks in 90 days via the `?utm_source=GMBlisting`
  homepage link, ~14% of all site clicks at avg. position 6.2) — the profile
  clearly exists and is indexed/trusted by Google even though on-page
  integration is thin (see findings below).
- 168 real, named, dated testimonial entries plus tour-embedded reviews exist in
  the content model (`src/content/testimonials/*.mdx`), giving genuine
  reputation depth to draw on.

---

## Findings

### Critical: /rent-bike-porto-portugal/ actively refuses the exact intent it ranks for

Live page content (verified both in source `src/content/pages/bicycles.mdx` and
on the rendered URL): _"IMPORTANT NOTE: The bicycles shown in the images below
are only used in our bike tours. They are not available for rental services."_
and, in bold caps, _"WE DO NOT RENT BICYCLES FOR LONG DISTANCES! WE WILL NOT
REPLY TO ANY EMAIL REQUESTING BIKE RENTAL SERVICES."_ Yet the URL slug
(`rent-bike-porto-portugal`), page title ("Bike Rental Porto | E-Bike Rental |
Top Bike Tours Portugal"), and Search Console data (1,701 impressions, position
25.4) all target rental/transactional intent — the same intent behind the Dutch
(_fiets huren porto_) and French (_location velo porto_) map-pack-adjacent
queries the account context flags as real demand. The page tells searchers, in
effect, to go elsewhere. This is very likely suppressing rankings on a page that
already gets meaningful impressions, and it wastes the exact query volume that
could feed a local map-pack pack result. **Fix**: Either (a) build a genuine
bike-rental product/service page — pricing, availability, booking flow,
`Product`/`Offer` schema — to capture the demand this URL already attracts, or
(b) deliberately re-target the URL/title/meta away from rental language toward
"our tour fleet" framing and stop competing for rental queries it will never
convert. The current middle state (rental title + refusal copy) is the worst of
both.

### High: City-name mismatch in NAP locality — "Oporto" (EN) vs "Porto" (PT + citations)

`data/contact.json`: `en.address.city = "Oporto"`, `pt.address.city = "Porto"` —
same physical address, two different locality strings depending on language. The
live English page and its `LocalBusiness` schema both render "Oporto." The
confirmed TripAdvisor citation lists the city as "Porto." Google Maps / GBP
almost certainly also uses "Porto" (the modern, standard city name; "Oporto" is
an archaic English exonym rarely used in current listings). This is a literal
`addressLocality` inconsistency between the site's own English schema and its
own Portuguese schema, and between the site and a verified external citation.
**Fix**: Standardize `addressLocality` to "Porto" for both locales in
`contact.json`; there is no external source found that corroborates "Oporto."

### High: No structured review markup on the page that most needs it (the reviews hub and the LocalBusiness entity)

`/testimonials/` (`src/content/pages/testimonials.mdx`) renders 168 testimonials
plus tour-embedded reviews through `reviews-collection.astro` →
`review-item.astro` as plain HTML cards (star icons via a `<Rating>` component)
— there is no `Review` or `AggregateRating` JSON-LD anywhere on that page.
Separately, the sitewide `LocalBusiness` schema in `organization-schema.astro`
also has no `aggregateRating` property, despite a real, computable rating
existing (the same aggregation logic already used per-tour via
`getAggregatedReviews()` could be rolled up for the entity). Per-tour Product
schema does this correctly (see "What works") — the gap is specifically at the
hub/entity level, which is what most directly supports a `LocalBusiness`/GBP
rich-result and AI-answer trust signal. **Fix**: Add `aggregateRating` (and
ideally a handful of `review` entries) to `organization-schema.astro`, computed
the same way `tour-page.astro` already does; add `Review`/`AggregateRating`
JSON-LD to `testimonials.mdx`.

### High: Generic `LocalBusiness` type instead of a more specific Google-supported subtype

`organization-schema.astro` emits `'@type': 'LocalBusiness'` sitewide. Per
Whitespark 2026, primary category correctness is the **#1 local ranking factor**
and the wrong category is the **#1 negative factor** — the same specificity
principle applies to on-page entity typing. The business's own TripAdvisor
category string is "City Tours, Cultural Tours, Bike Tours, Walking Tours, Gear
Rentals," and it sells multi-day package tours (with lodging, guiding, support
vehicles per testimonial content) — this is a tour-operator/travel-agency
business model, not a fixed single-activity venue. Of the Google-supported
subtypes available (`TravelAgency`, `TouristInformationCenter`,
`SportsActivityLocation`), `TravelAgency` is the best match;
`SportsActivityLocation` implies a fixed venue for one activity, which
undersells the multi-region package-tour model; `TouristInformationCenter`
doesn't fit at all (that's for information centers, not sellers of tours).
**Fix**: Change `'@type'` to `'TravelAgency'` (or
`['LocalBusiness','TravelAgency']`) in `organization-schema.astro`, and align
actual GBP primary category to match if it isn't already "Tour operator" /
"Bicycle tour agency."

### High: Review recency/velocity is invisible on-site and shows real multi-month gaps

Testimonial content dates (`src/content/testimonials/*.mdx`, `date`
frontmatter): 2025-05-20 → 2025-05-31 → 2025-07-31 → 2025-10-31, then **17
reviews all timestamped the same afternoon, 2025-11-05 between 14:18 and 14:48**
— a batch content import, not organic drip publication. `review-item.astro`
never renders a date to users at all. Against the 18-day rule (Sterling Sky:
rankings cliff after ~3 weeks with no new reviews), the on-site content shows
multi-month silent stretches with zero visible freshness signal for users or
crawlers. (Caveat: this describes the site's testimonial _content_ cadence, not
necessarily the live GBP/TripAdvisor review velocity, which could not be
directly verified — see Not assessed.) **Fix**: Display review dates on-page;
publish testimonials on a steady cadence (e.g., monthly) rather than in batches;
if the underlying GBP/TripAdvisor velocity is actually healthy, at minimum
surface that recency on-site so it functions as a visible trust/freshness
signal.

### Medium: No `areaServed` despite an explicitly hybrid/multi-region business model

`organization-schema.astro` has no `areaServed` property. The business runs
tours across Douro, Minho, Alentejo, the Silver Coast, the Algarve, and the
Camino/Santiago de Compostela (into Spain) — exactly the pattern the schema
reference guide flags as needing named-city `areaServed` entries with `sameAs`
links to Wikipedia/Wikidata for SAB/hybrid businesses. Missing it undersells
geographic breadth to both classic local search and AI answer engines (3 of the
top 5 AI-visibility factors are citation/entity-related per the brief). **Fix**:
Add an `areaServed` array (Porto, Douro Valley, Minho, Alentejo, Silver Coast,
Algarve, Santiago de Compostela) with `sameAs` Wikidata links.

### Medium: ~650m offset between schema geo-coordinates and the actual Google Maps pin

`contact.json` / schema geo: `41.155230, -8.608440`. The confirmed Google Maps
place "Top Bike Tours Portugal" resolves to `41.1499779, -8.6022513` — roughly
650 meters away in central Porto. Both points are precise to 6 decimals (exceeds
the 5-decimal recommendation), but they don't point at the same place, which is
a minor entity-consolidation risk between the schema-declared location and the
GBP pin actually shown to searchers. **Fix**: Re-geocode the schema coordinates
from the exact GBP pin (or confirm which is correct and correct the other) so
both sources agree.

### Medium: Minimal on-page GBP integration despite GBP being a major, active channel

The live homepage/contact block has no embedded Google Map (`iframe`), no
live/pulled Google review widget or star-rating display, and no visible GBP
posts or photo evidence — the only GBP touchpoint found is a text link to
"Google My Bussiness" [sic] buried in `/testimonials/` body copy. This is a
mismatch given GBP is confirmed to be a materially productive channel (~32,767
impressions / 303 clicks / 90 days via the GMBlisting UTM, ~14% of all site
clicks). **Fix**: Embed the Maps location and surface a live or
periodically-refreshed GBP review pull (with matching schema) on the homepage
and/or contact page, not just referenced in testimonials copy.

### Medium: No localized landing pages for the non-English local demand already showing in Search Console

The `LanguageCodes` type and the testimonials content schema
(`.astro/collections/testimonials.schema.json`) enumerate only `"en"` and `"pt"`
as supported languages — no Dutch or French locale/page set was found. Search
Console shows meaningful demand in Dutch (_fiets huren porto_, _fietstour in
porto_) and French (_location velo porto_), all of which are currently served
only by English pages with no NL/FR targeting. **Fix**: At minimum, add NL/FR
meta targeting (and eventually landing content) on the highest-volume pages
(bike rental, Porto tours) rather than relying on English pages to absorb this
demand.

### Medium: External citation (TripAdvisor) lists "Gear Rentals" as a category, contradicting the site's own rental refusal

The TripAdvisor listing's category string includes "Gear Rentals," directly
conflicting with the emphatic "WE DO NOT RENT BICYCLES … WE WILL NOT REPLY TO
ANY EMAIL REQUESTING BIKE RENTAL SERVICES" policy on
`/rent-bike-porto-portugal/`. This external-signal-vs-on-site-policy
contradiction likely compounds the Critical finding above by reinforcing rental
intent/category association that the business then refuses to fulfill. **Fix**:
Align the TripAdvisor category/description with the actual service offering, or
resolve the underlying business-policy question first (see Critical finding)
before trying to fix the category mismatch.

### Low: Typo in the reviews page's own meta description

`/testimonials/` `seo.page_description` reads: _"Reviwes portugal bike tours"_ —
a live typo in the search-facing description of the page that exists
specifically to build local trust/reputation. **Fix**: Correct to something like
"Real reviews from cyclists who took our Portugal bike tours."

### Low: `openingHoursSpecification` has no Sunday entry or seasonal variation

Schema covers Mon–Fri 09:00–18:00 and Sat 09:00–13:00 only. Plausible for an
office-hours tour operator, but not cross-checked against actual GBP hours (out
of scope here — see Not assessed). **Fix**: Confirm against live GBP hours and
add explicit Sunday closed / seasonal specification if applicable.

---

## NAP consistency audit

| Source                                    | Name                    | Street                   | City       | Postal Code | Phone                             |
| ----------------------------------------- | ----------------------- | ------------------------ | ---------- | ----------- | --------------------------------- |
| Live page (EN)                            | Top Bike Tours Portugal | Rua Dom João IV 385, nº1 | **Oporto** | 4000-303    | (+351) 915 316 999                |
| `LocalBusiness` schema (EN, sitewide)     | Top Bike Tours Portugal | Rua Dom João IV 385, nº1 | **Oporto** | 4000-303    | (+351) 915 316 999                |
| `contact.json` (PT locale)                | —                       | Rua Dom João IV 385, nº1 | **Porto**  | 4000-303    | (+351) 915 316 999                |
| TripAdvisor (verified)                    | Top Bike Tours Portugal | not shown                | **Porto**  | —           | not shown                         |
| Google Maps place (verified via redirect) | Top Bike Tours Portugal | not extracted            | —          | —           | geo ~650m from schema coordinates |

Discrepancy: "Oporto" (EN schema/visible) vs. "Porto" (PT schema + TripAdvisor).
See High finding above.

## LocalBusiness schema validation summary

| Property                    | Present                   | Notes                                                                      |
| --------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| `name`                      | Yes                       | Matches visible content                                                    |
| `address`                   | Yes                       | Full `PostalAddress`; locality inconsistent across locales (see finding)   |
| `geo`                       | Yes                       | 6-decimal precision (exceeds 5-decimal minimum); ~650m off actual Maps pin |
| `openingHoursSpecification` | Yes                       | Mon–Fri + Sat only, no Sunday/seasonal                                     |
| `telephone`                 | Yes                       | Consistent with visible content                                            |
| `url`                       | Yes                       |                                                                            |
| `priceRange`                | Yes                       | "€€"                                                                       |
| `aggregateRating`           | **No**                    | Real data exists (per-tour) but not rolled up to entity level              |
| `areaServed`                | **No**                    | Missing despite hybrid/multi-region model                                  |
| `@type`                     | `LocalBusiness` (generic) | Recommend `TravelAgency` — see High finding                                |

Per-tour `Product` schema (`tour-product-schema.astro`) separately and correctly
implements real `AggregateRating` from actual review data — this part of the
schema implementation is solid and should be the model for fixing the
entity-level gap.

---

## Not assessed

- Live GBP profile itself (primary category, Q&A, posts cadence, photo count,
  response rate to reviews) — DataForSEO MCP account is out of credit (HTTP 402)
  and no other GBP API access was available; inferred only indirectly via Search
  Console context provided and a Maps redirect resolution.
- Whether the ~650m geo offset reflects a genuine pin/address error or simply a
  different reasonable point within the same building/area — only the coordinate
  pair was resolved, not the GBP's own listed street-address text.
- Yelp/BBB presence — low relevance for a Porto-based EU tour operator; more
  relevant citation sources (GetYourGuide, Viator, Civitatis, Booking.com
  Experiences) were not checked.
- Full enumeration of every local/city landing page in `src/content/pages/`
  beyond the homepage, `/testimonials/`, and `/rent-bike-porto-portugal/` — this
  was a targeted review, not a full-site crawl.
- Whether any NL/FR hreflang or partial localization exists beyond the
  `"en"`/`"pt"` `LanguageCodes` enum observed in the testimonials content
  schema.
- Actual live GBP/TripAdvisor review velocity (as opposed to on-site testimonial
  content velocity, which was directly measured from file timestamps).
- Rendered DOM verification via headless browser — the bundled `render_page.py`
  tool errored (`ModuleNotFoundError: No module named 'bs4'`) and
  `claude-seo run` reported its runtime was not set up; live-page checks were
  instead done via direct WebFetch of production URLs plus the site's own source
  code, which should be materially equivalent for static/SSR content but does
  not rule out client-side-injected elements (e.g., a Maps embed or review
  widget added purely via JS after initial render).
