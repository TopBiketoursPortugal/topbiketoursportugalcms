# Full SEO audit — topbiketoursportugal.com

**Run:** 2026-08-13 · **Health score: 52/100** · **Business type:** local
service operator with productised multi-day tours (Porto-based cycling tour
operator)

Eleven specialist passes. Every checkable claim was re-verified against `dist/`
or live production before inclusion; two agent findings were rejected on
verification and are recorded rather than deleted. The prioritised remediation
sequence lives in **[ACTION-PLAN.md](ACTION-PLAN.md)** — this document is the
evidence record.

---

## Scores

| Category                 | Weight | Score | Contribution |
| ------------------------ | -----: | ----: | -----------: |
| Technical SEO            |    22% |    68 |        14.96 |
| Content Quality          |    23% |    34 |         7.82 |
| On-Page SEO              |    20% |    45 |         9.00 |
| Schema / Structured Data |    10% |    64 |         6.40 |
| Performance (CWV)        |    10% |    38 |         3.80 |
| AI Search Readiness      |    10% |    58 |         5.80 |
| Images                   |     5% |    92 |         4.60 |
| **Health score**         |        |       |     **52.4** |

Technical was raised from the specialist's 58 to 68 after its Critical finding
was disproved (see _Rejected findings_). On-Page carries no dedicated specialist
score; it is derived from the SXO, visual and internal-link evidence.

---

## Search Console ground truth

This is the frame the whole audit sits in. Data ends **2026-08-11**; no change
made on 12–13 August appears in it.

| metric       | 90 days |
| ------------ | ------- |
| clicks       | 2,092   |
| impressions  | 200,772 |
| CTR          | 1.04%   |
| avg position | 14.6    |

Year over year, **positions improved substantially while clicks stayed flat** —
desktop average position 24.4 → 15.8, mobile 18.7 → 12.1, clicks 2,103 → 2,079.
Every page that grew is a blog post; every commercial tour page declined. The 15
multi-day tour pages earned **17 clicks in nine months**.

---

## Category evidence

Full write-ups in [`findings/`](findings/). Highlights:

**Technical (68)** — 900 redirect rules verified clean: no loops, no internal
chains, no dead destinations, all 301. No CSP, X-Content-Type-Options,
Referrer-Policy, X-Frame-Options or Permissions-Policy; only HSTS. Legacy
`http://www` takes two hops to the canonical apex.

**Content (34)** — lowest-scoring substantive category. Of 135 English posts,
only 5 clear 1,500 words and 13 sit under 300 (one is 6 words). Four duplicate
clusters cannibalise each other and the tours they should feed: Camino (15
posts), Porto–Lisbon (7), Douro (4), Alentejo (4). 55 posts carry a faceless
"Editorial Team" byline.

**On-Page (45)** — title/H1 mismatch on the flagship catalogue page. Portuguese
form label on 21 English tour pages (fixed this session). Contextual inbound
links per tour range 16–60; the mega-menu adds ~230 sitewide links per tour but
is identical for all of them, so it confers no relative advantage.

**Schema (64)** — split `#organization` `@id` by locale. `Person.name` carries
whole byline sentences in six variants. Tour `Product` schema attaches
`shippingDetails` and `MerchantReturnPolicy` to an intangible service. Verdict
on Product vs TouristTrip: **keep Product** — TouristTrip has no Google
rich-result support, and the review-star snippet currently works.

**Performance (38)** — lab only, no CrUX credentials. Homepage mobile 58 (LCP
3.0s, TBT 5,960ms, CLS 0.002). Tour page mobile 38 (**LCP 17.6s, TBT 8,080ms**).
Blog mobile 40 (LCP 17.7s). 345 KB render-blocking CSS on the tour page, of
which 51.4 KB is editor-only. Critters is configured but inlines just 2.2 KB.

**AI Search Readiness (58)** — AI crawler access is genuinely unobstructed:
`robots.txt` is fully open and a GPTBot-UA fetch returns byte-identical HTML. So
the AI Assistant channel converting at **11.3%** (best on the site) is not
capped by a block. The flagship page buries its only citable content at ~86%
depth in a 265 KB document.

**Images (92)** — the site's strongest category, measured across all 447 pages:
16,562 `<img>` tags, 99.9% with real alt text, 100% with explicit width/height,
100% with a loading attribute, WebP/AVIF pipeline active.

**Local (55)** — `/rent-bike-porto-portugal/` ranks for rental intent while
telling visitors it does not rent bikes. `data/contact.json` uses "Oporto" for
English and "Porto" for Portuguese — a NAP mismatch against the company's own
GBP and Tripadvisor listings, on a site where GBP-tagged traffic is 14% of all
clicks.

**SXO (22)** — lowest score in the audit, and the most strategically important.
"Best X" SERPs are owned by third-party roundups and marketplaces; an operator's
catalogue page cannot satisfy that intent.

**Cluster (52)** — validates the Camino hub as genuinely winnable (that SERP is
operator-dominated, unlike "best X"), and confirms
`3-day bike tour in douro valley` (796 impressions) as unserved transactional
demand deserving a product.

**Backlinks (41)** — 177 referring domains, but ~85% of the 3,733 links are
non-editorial footer image links. The single genuine editorial product link is
from Epic Road Rides. At most 3 of 21 tour pages have any external equity.

---

## Rejected findings

Recorded because a disproved claim is itself information.

1. **"All tour taxonomy pages serve an identical 20-tour list."** Disproved.
   Measured inside `<main>`: `/tours/tags/wine/` 8 tours,
   `/tours/tags/families/` 1, `/tours/regions/algarve/` 1, zero overlap between
   them. The agent counted the sitewide mega-menu. Filtering works.

2. **"A 13.8 MB JavaScript bundle ships to visitors."** The file is real, but
   loads only under `window.inEditorMode`. Visitors never fetch it. Its
   _stylesheet_ is unconditional — that is the real, smaller finding.

---

## Not assessed

- Field CWV (CrUX) — plugin Google credentials absent; all numbers are lab.
- Root cause of TBT 8,080ms — measured, not isolated, not guessed.
- Live backlink re-measurement — DataForSEO at HTTP 402, no Moz/Bing keys.
- Portuguese content depth, freshness, readability.
- IndexNow, blog pagination scheme, viewport specifics.
