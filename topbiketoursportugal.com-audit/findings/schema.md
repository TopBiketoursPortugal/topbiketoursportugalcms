# Schema.org Audit — topbiketoursportugal.com

## Score: 64/100

Source: built output at `dist/` (451 HTML files), cross-referenced against the
Astro source components in `src/components/schema/`. All JSON-LD parsed without
error (0 malformed blocks across 448 pages carrying structured data).

Type census across the full build:

| @type          | Pages |
| -------------- | ----- |
| LocalBusiness  | 448   |
| BreadcrumbList | 445   |
| BlogPosting    | 270   |
| ItemList       | 71    |
| Product        | 42    |
| Person         | 14    |
| Place          | 12    |
| FAQPage        | 4     |
| CollectionPage | 2     |
| WebSite        | 2     |

## What works

- **Zero JSON-LD parse errors** across the entire build — every block is valid
  JSON, `@context` is `https://schema.org`, dates are ISO 8601, URLs are
  absolute.
- **No deprecated types shipped.** No `HowTo`, no `SpecialAnnouncement`. Good
  discipline.
- **`FAQPage` is not on tour pages.** `tour-faqs.astro` renders the FAQ
  accordion without `type="faq"`, so the `FAQPage` generator in
  `accordion.astro` never fires there. It only fires on 4 utility pages
  (`/faqs`, `/cancellation-policy`, and their `/pt/` equivalents) — see Finding
  below, but this is a narrow footprint, not a site-wide problem.
- **`aggregateRating` on tour `Product` schema is gated on real on-page
  reviews.** `tour-page.astro` computes `average`/`count` via
  `getAggregatedReviews()` from the same `testimonials` collection + frontmatter
  `reviews` that render visibly in the on-page reviews carousel, and
  `tour-product-schema.astro` only emits `aggregateRating` when
  `ratingCount > 0 && ratingAverage > 0`. No fabricated ratings. Confirmed in
  the shipped output, e.g. `/tours/bike-tours-douro-valley-easy/`:
  `"aggregateRating":{"ratingValue":"5.0","reviewCount":1,...}` — thin but
  genuine.
- **Image 404 bug already fixed.** `resolveSchemaImage()` resolves frontmatter
  source paths (`/src/assets/...`) and the logo to real built `/_astro/...` URLs
  rather than shipping unfetchable paths — confirmed in output
  (`"logo":"https://topbiketoursportugal.com/_astro/logo.B9x-J9-l.png"`).
- **`WebSite` is scoped correctly** — only defined in full on the two homepages
  (en/pt), with every other page's context implied via existing
  `Organization`/`Breadcrumb` blocks. Not duplicating the full `WebSite` object
  site-wide is correct practice, not a gap.
- **Breadcrumbs ship on 445/448 pages** and Google Search Console already
  confirms Breadcrumb rich results are live.

## Findings

### Critical: Organization/LocalBusiness entity is split in two by locale

`organization-schema.astro` derives `@id` from the per-language `baseUrl`:

```js
const baseUrl = site.site.url.replace(/\/$/, '');
...
'@id': `${baseUrl}/#organization`,
```

Because `data/site.json` gives the `pt` locale its own site URL
(`https://topbiketoursportugal.com/pt/`), the built output defines **two
separate `LocalBusiness` entities** for what is one company:

- EN pages: `"@id":"https://topbiketoursportugal.com/#organization"`
- PT pages: `"@id":"https://topbiketoursportugal.com/pt/#organization"`

(Confirmed directly in `dist/index.html` vs `dist/pt/index.html`, and the split
propagates into every `BlogPosting.publisher` reference too — PT posts point at
the PT id, EN posts at the EN id.)

This fragments the entity graph Google uses to consolidate brand signals
(reviews, sameAs, NAP, Knowledge Panel candidacy) exactly where it matters most:
the brand term dropped from position 1.4 to 4.9 YoY, and a split Organization
identity is a plausible contributor — Google has two competing,
partially-overlapping `LocalBusiness` nodes to reconcile instead of one
authoritative one.

**Fix** — keep one canonical `@id` regardless of language; only the `url` field
(and localized name of the page) should vary:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://topbiketoursportugal.com/#organization",
  "name": "Top Bike Tours Portugal",
  "url": "https://topbiketoursportugal.com/pt",
  "description": "Empresa líder em passeios de bicicleta guiados e autoguiados em Portugal...",
  "telephone": "(+351) 915 316 999",
  "email": "reservations@topbiketoursportugal.com",
  "sameAs": ["..."]
}
```

i.e. in `organization-schema.astro`, hardcode the `@id` host to the primary
domain instead of deriving it from the localized `baseUrl`:

```js
const canonicalOrigin = 'https://topbiketoursportugal.com';
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${canonicalOrigin}/#organization`,
  'url': baseUrl,
  ...
};
```

Apply the same fix to `website-schema.astro`'s `publisher.@id` and
`blog-posting-schema.astro`'s `publisher.@id`, which currently inherit the same
per-locale split.

### High: BlogPosting `author.name` contains a sentence, not a name

Shipped on every one of the 270 `BlogPosting` blocks, e.g.:

```json
"author": {
  "@type": "Person",
  "name": "Written by Sérgio Marques ,Founder & Route Designer, Top Bike Tours Portugal"
}
```

(PT equivalent:
`"Escrito por Sérgio Marques, Fundador & Route Designer da Top Bike Tours Portugal"`.)

`Person.name` must be a name, not a byline sentence — this is invalid use of the
property, breaks author entity consolidation across the 270 posts (each one is
technically a _different_ string, so Google can't reliably cluster them into one
Person), and the EN string additionally has a stray space before the comma
(`"Marques ,Founder"`). This actively works against author/E-E-A-T
signal-building at the same time the brand is trying to recover ranking.

**Fix:**

```json
"author": {
  "@type": "Person",
  "name": "Sérgio Marques",
  "jobTitle": "Founder & Route Designer",
  "worksFor": { "@id": "https://topbiketoursportugal.com/#organization" }
}
```

### High: Tour `Product` schema declares goods-shipping and goods-return properties on an intangible multi-day service

`tour-product-schema.astro` unconditionally attaches, on every priced tour:

```json
"hasMerchantReturnPolicy": {
  "@type": "MerchantReturnPolicy",
  "applicableCountry": "PT",
  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
  "merchantReturnDays": 14
},
"shippingDetails": {
  "@type": "OfferShippingDetails",
  "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "EUR" },
  "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "PT" },
  "deliveryTime": { ... }
}
```

A guided/self-guided cycling holiday is not a shipped physical good.
`OfferShippingDetails` with a 0-day handling/transit time to Portugal is not
meaningful for a service booked and consumed entirely in Portugal, and a "14-day
return window" framed via `MerchantReturnPolicy` doesn't correspond to how a
tour cancellation policy actually works (tiered refund windows tied to departure
date, not a return-goods window) — I did not cross-check the literal 14-day
figure against `/cancellation-policy` content, so treat the factual accuracy of
that number as unverified in addition to the type mismatch.

**Fix** — drop `shippingDetails` entirely (not applicable to a service), and
either drop `hasMerchantReturnPolicy` or replace it with the real policy framed
correctly. If Google's Offer requirements are the concern, a service business is
not required to declare shipping at all:

```json
"offers": {
  "@type": "Offer",
  "price": 1689,
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock",
  "url": "https://topbiketoursportugal.com/tours/bike-tours-douro-valley-easy/"
}
```

### Medium: BlogPosting missing `dateModified`, `mainEntityOfPage`, and `publisher.logo`

`blog-posting-schema.astro` emits `headline`, `datePublished`, `author`,
`image`, `wordCount`, `publisher` — but never `dateModified` and never gives
`publisher` a `logo` (`ImageObject`). Both are effectively required for
Article-family rich result / Top Stories eligibility per Google's structured
data guidelines, and `dateModified` is a normal freshness signal for AI/LLM
crawlers as well. `mainEntityOfPage` is also absent, which is a standard,
low-cost Article property Google's own examples always include.

**Fix:**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How Far Can an E-Bike Go? Charging, Terrain & Battery Life Tips",
  "datePublished": "2025-05-21T13:22:59.000Z",
  "dateModified": "2025-05-21T13:22:59.000Z",
  "mainEntityOfPage": "https://topbiketoursportugal.com/blog/how-far-can-an-e-bike-go-portugal/",
  "url": "https://topbiketoursportugal.com/blog/how-far-can-an-e-bike-go-portugal/",
  "author": {
    "@type": "Person",
    "name": "Sérgio Marques",
    "jobTitle": "Founder & Route Designer"
  },
  "image": "https://topbiketoursportugal.com/_astro/how-far-can-an-e-bike-go.57P950AI.jpg",
  "wordCount": 769,
  "publisher": {
    "@type": "Organization",
    "@id": "https://topbiketoursportugal.com/#organization",
    "name": "Top Bike Tours Portugal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://topbiketoursportugal.com/_astro/logo.B9x-J9-l.png"
    }
  }
}
```

(Requires the CMS to actually track a modified date distinct from
`datePublished`; if the content collection has no such field yet, that's a
prerequisite content-model change, not just a template edit.)

### Low: `Offer.availability` is hardcoded to `InStock`

`tour-product-schema.astro` always sets
`"availability": "https://schema.org/InStock"` whenever a price is present —
there's no branch for seasonal/off-season or sold-out tours. Given the site has
a real booking calendar (`/guided-bike-tours-calendar-portugal`), this is a
low-risk but technically inaccurate structured data claim if a route is
genuinely unavailable for a stretch of the year. Not urgent, but worth wiring to
real capacity data if/when that becomes available in the CMS.

### Info: `FAQPage` still shipping on 4 pages

`accordion.astro` still generates `FAQPage` mainEntity markup, live on `/faqs`,
`/cancellation-policy`, and their `/pt/` equivalents. Per current guidance,
Google retired FAQ rich results for all sites (7 May 2026), so this markup now
earns no SERP feature. It is not actively harmful (small, correctly-formed,
doesn't misrepresent content), so this is Info, not Critical/High — but it
should not be extended to additional pages under the assumption it drives a rich
result, and any AI/GEO benefit from keeping it is unconfirmed. If/when the FAQ
content is cleaned up, consider whether the `/faqs` page content reads better as
`QAPage` (only if it's genuinely user-submitted Q&A, which it is not — it's the
operator's own FAQ copy) or just plain content with no schema at all.

## Product vs TouristTrip for multi-day tours — reasoned verdict

**Keep `Product` as the primary type; do not replace it with `TouristTrip`.**

The only piece of this schema graph with a _confirmed_ SERP payoff is the
star-rating / review-count snippet, and that snippet eligibility is defined
against `Product` (or `LocalBusiness`/`Organization`) + `AggregateRating` in
Google's supported gallery. `TouristTrip` (a subtype of `Trip`) is the more
semantically accurate schema.org type for a multi-day guided/self-guided cycling
itinerary — it can express `itinerary`, `provider`, `offers` — but Google has
**no rich-result treatment for `Trip`/`TouristTrip` at all**. Switching the
primary type away from `Product` would forfeit a working, confirmed SERP feature
(review stars) for schema.org purity with zero search upside.

The actual fix isn't the top-level `@type` — it's the two type-mismatched
properties borrowed wholesale from physical-goods e-commerce (`shippingDetails`,
goods-style `hasMerchantReturnPolicy`) that don't belong on a service `Offer`
(see High finding above). Fix those, keep `Product` + `AggregateRating` +
`Offer` for the SERP-relevant part of the graph. If there's appetite for the
more semantically correct `TouristTrip` representation, add it as a **secondary,
non-replacing** block (e.g. `additionalType` on the `Product`, or a second
`@type` array `["Product","TouristTrip"]` sharing the same node) purely for
entity clarity to LLMs/AI answer engines — but be explicit with stakeholders
that this is unconfirmed AI/GEO upside, not a Google SERP feature, same caveat
as FAQPage.

## Not assessed

- **`sameAs` completeness.** Confirmed the `Organization` schema emits
  `facebook`, `instagram`, `tripadvisor`, `twitter` from `data/social.json`, but
  did not read that file's actual URL values or check for gaps (LinkedIn,
  YouTube, Wikidata, Google Business Profile / Knowledge Panel claim URL) —
  worth a follow-up pass given the brand-entity focus.
- **Full validation of all 42 `Product` pages.** Only spot-checked one tour
  (`bike-tours-douro-valley-easy`). Did not confirm whether any tour pages ship
  with `price = 0` (which silently drops the entire `offers` block per the
  component's `if (effectivePrice > 0)` guard) or `reviewCount = 0` (which drops
  `aggregateRating`) — i.e. whether any bookable tours are currently missing
  rich-result-eligible `Offer`/`AggregateRating` blocks entirely.
- **`ItemList` (71 pages) and `Place` (12 pages) blocks** — not individually
  validated for required/recommended properties beyond reading the source
  templates (`tour-list-schema.astro`, `place-schema.astro`).
- **`Person` (14) and `CollectionPage` (2) blocks** — not located/read; likely
  team-page and a couple of hub pages, but not confirmed against dist output.
- **Region/hub pages (`/tours/regions/*`, tag/rider-level/bike-type listings)**
  — confirmed they use the deliberately-slim `ItemList` generator
  (`tour-list-schema.astro`) per its own code comment about a prior
  duplicate-review/duplicate-rating bug, but did not verify current output
  matches that intent across all 71 instances.
- **Missing-opportunity schema for 2026 SERP features** beyond what's flagged
  above (e.g. `Event`/departure-date schema for scheduled group tours,
  `VideoObject` if video assets exist, `MerchantListing`/`Product` feed
  eligibility for Google's Shopping graph) — not scoped in this pass; would need
  a page-type inventory first.
- **Literal accuracy of the 14-day `merchantReturnDays` figure** against the
  real `/cancellation-policy` content — flagged as a type-mismatch problem above
  but the number itself wasn't cross-checked.
