# Action plan — topbiketoursportugal.com

**Health score 52/100.** Audit run 2026-08-13. Eleven specialist passes; every
checkable claim below was re-verified against `dist/` or the live site before
being included. Findings that did not survive verification are listed at the
bottom rather than quietly dropped.

---

## Phase 0 — Nothing from this session is live yet

The branch is **3 commits ahead of `origin`** and unpushed, so every fix made
today exists only locally. Verified against production:

| URL                           | live status                     | expected after deploy                 |
| ----------------------------- | ------------------------------- | ------------------------------------- |
| `/testimonials/silver-coast/` | **404**                         | 301 → `/testimonials/`                |
| `/tags/douro/`                | **404**                         | 301 → `/blog/tags/wine-douro-valley/` |
| `/rail-trail-ecopista-tamega` | 200, but to the generic listing | 301 → the Douro day tour              |

The 37 testimonial URLs and 30 tag URLs the Gatsby site ranked on are still
returning 404 to Google and to any external link pointing at them. The
rail-trail URL resolves only because the _old_ redirect to
`/bike-tours-in-portugal/` is still deployed.

Push and deploy before measuring anything else. Nothing below can be evaluated
against a site that does not have it.

---

## Phase 1 — Critical (this week)

### 1. The bike-rental page attacks the intent it ranks for

`/rent-bike-porto-portugal/` is titled _"Bike Rental Porto | E-Bike Rental"_,
draws 1,701 impressions at position 25.4, and its body says:

> WE DO NOT RENT BICYCLES FOR LONG DISTANCES! WE WILL NOT REPLY TO ANY EMAIL
> REQUESTING BIKE RENTAL SERVICES

Dutch and French rental queries (`fiets huren porto`, `location velo porto`,
`fietsverhuur porto`) are landing here. Either serve the intent or stop ranking
for it — the current state spends authority to produce hostility.
**Falsifiable:** if rewritten to state plainly what _is_ offered, CTR on this
page should move off 0.29% within 8 weeks.

### 2. Portuguese label on 21 English tour forms — FIXED

`data/i18n.json` carried `"Endereço de Email"` in the **`en`** block. The `pt`
block separately (and correctly) carried `"Endereço de Correio Electrónico"`, so
this was the wrong language pasted into an English key, not a missing
translation. It rendered on the lead-capture form of 21 of 25 English tour
pages. Fixed this session.

### 3. Brand entity is split by locale

`#organization` is emitted as two distinct `@id`s: `.../#organization` and
`.../pt/#organization`. Google is being handed two organizations. The brand term
`top bike tours portugal` fell from position **1.4 to 4.9** year over year.
Consolidate to a single `@id`, with the PT page referencing it rather than
redeclaring it. **Falsifiable:** if the split is a contributing cause, brand
position should recover toward 2.x within a quarter. If it does not, the cause
is elsewhere and this becomes cleanup rather than a fix.

### 4. Author entity is unusable

Every `BlogPosting` puts a whole byline sentence in `Person.name`:
`"Written by Sérgio Marques ,Founder & Route Designer, Top Bike Tours Portugal"`
— in **six inconsistent variants**, plus 55 posts bylined to
`"Top Bike Tours Portugal Editorial Team"`. Put the person's name in `name`, the
role in `jobTitle`, and link to a real author page. This is the cheapest E-E-A-T
repair available.

---

## Phase 2 — High (2–3 weeks)

### 5. Stop chasing "best bike tours portugal" with the catalogue page

SERP analysis of the "best X" family found it dominated by third-party roundups
and marketplaces — TourRadar, Tripadvisor, Travelstride, epicroadrides. An
operator's own inventory page cannot structurally satisfy comparison intent.
That is why `/bike-tours-in-portugal/` holds positions 3.8–9.2 across six
commercial variants and earns **zero clicks** on ~900 impressions.

This **overturns the keyword map published earlier today**, which assigned that
family to this page. Correct approach: retitle it honestly as a catalogue, fix
its title/H1 mismatch (`"The Best Bike Tours in Portugal"` vs H1
`"Bike tours Portugal | Cycling Holidays"`), and pursue that traffic through
placement _inside_ the roundups that already rank.

### 6. The Camino hub is winnable — unlike the "best X" terms

Important distinction: the `camino de santiago bike tours` SERP is dominated by
**operator** pages (Backroads, Bike Spain, Bike Iberia's own `/camino/` hub),
not marketplaces. A comprehensive owned hub at
`/tours/regions/santiago-compostela/` is a real competitive play, not a
consolation prize. That term drew 1,441 impressions across **four** competing
tour pages at positions 11.9, 51.3, 57.8 and 71.9 — classic cannibalisation with
no owner.

### 7. Render-blocking CSS, including editor-only styles

The tour page ships **345 KB** of render-blocking CSS. Of that, **51.4 KB** is
`registerComponents.DCmopQgs.css` — styling for the CloudCannon editing
interface. Its JavaScript counterpart is correctly gated behind
`window.inEditorMode`; the stylesheet is not. Gate the CSS the same way.

The page also carries `data-critters-container`, so critical-CSS inlining is
configured, yet only **2.2 KB** is inlined against 345 KB blocking. Critters
appears not to be working on this template.

### 8. Index bloat: more taxonomy pages than tours

Of 447 sitemap URLs: **48 tour taxonomy term pages + 6 taxonomy index pages
against 42 actual tour detail pages**, plus 40 blog tag pages. Several taxonomy
pages outrank the tours they list. Several are near-empty
(`/tours/tags/families/` lists 1 tour; `/tours/regions/algarve/` lists 1).
Noindex the thin terms and drop them from the sitemap.

`/thank-you-page/` is `noindex, follow` **and** listed in the sitemap — a
contradictory signal. Exclude it at build time.

---

## Phase 3 — Content and authority (month 2)

### 9. Build a 3-day Douro product

`3-day bike tour in douro valley` drew 796 impressions across two pages that
both sell week-long trips. A competitor ranks #1 with a purpose-built 3-day
product. This is unserved transactional demand, and building it also resolves a
latent cannibalisation with the 7-day-easy page. **A product, not a blog post.**

### 10. Blog consolidation

135 English posts, of which only 5 clear 1,500 words and 13 sit under 300. Four
duplicate clusters cannibalise each other and the tours they should feed:
Camino/Santiago (15 posts), Porto–Lisbon (7), Douro (4), Alentejo (4). Merge
within cluster, redirect the losers.

Two pages draw large irrelevant impressions and should be judged on intent, not
CTR: `/blog/mountain-biking-in-portugal-guide/` takes 12,151 of its 12,384
impressions from the single global query `best mountain biking trails` at
position 8.6 with 0 clicks; `uniting-teams-the-5-best-team-building-activities`
draws 3,208 impressions from an audience with no booking intent.

### 11. Links to the pages that convert

Domain has 177 referring domains and 3,733 backlinks — **not** link-poor. But
almost all of it sits on the homepage, and nine of fourteen commercial pages
tested have **zero** referring domains, including
`/tours/porto-santiago-compostela-bike-tour-coastal-way/` — the best-converting
page on the site at 6.7%. That is the single clearest link target.

Note `/bike-tours-in-portugal/` shows "76 backlinks" from **1** referring domain
— a single sitewide placement, worth roughly one link.

---

## Phase 4 — Monitoring

- Drift baseline captured 2026-08-13; re-run `/seo drift compare` after deploys.
- Re-pull GSC in late September: none of this session's changes are in the
  current data, which ends 2026-08-11.
- Watch mobile CTR specifically — mobile converts at 1.78% vs desktop 0.65%.
- **Leading indicator that does not need a re-audit:** impressions-to-clicks on
  the six "best bike tours portugal" variants. If Phase 2 item 5 is right, that
  ratio will not improve from on-page work alone.

---

## Did not survive verification

**Technical agent's Critical — "all tour taxonomy pages serve an identical
20-tour list."** False. Measured inside `<main>`: `/tours/tags/wine/` lists 8
tours, `/tours/tags/families/` 1, `/tours/regions/algarve/` 1, with **zero**
overlap between them. The agent almost certainly counted the sitewide mega-menu.
Filtering works correctly; finding dropped.

**A 13.8 MB JavaScript bundle.** `registerComponents.Bt8NjlSi.js` really is 13.8
MB, but it loads only under `window.inEditorMode`. Real visitors never fetch it.
Its stylesheet is the actual problem — see item 7.

## Not assessed

- **Field CWV data.** All performance numbers are Lighthouse **lab** under
  mobile throttling, not CrUX. Tour page mobile LCP 17.6s / TBT 8,080ms is real
  but lab-throttled; the TBT cause was not isolated and is not guessed at here.
- **Backlink profile detail.** DataForSEO is out of credit (HTTP 402); Moz and
  Bing keys absent. Per-page figures above are carried forward from the
  2026-08-12 pull, not re-measured today.
- Portuguese content depth, freshness, and readability.
- IndexNow, viewport specifics, blog pagination scheme.
