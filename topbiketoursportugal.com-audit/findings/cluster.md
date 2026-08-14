## Score: 52/100

Method note: DataForSEO was unavailable (HTTP 402), so this validates the
proposed map against live WebSearch organic results (US, Aug 2026) rather than
DataForSEO's `serp_organic_live_advanced`. WebSearch returns 6-9 organic links
per query (not a guaranteed top-10), so absolute overlap counts are directional,
not exact DataForSEO-grade scores. Treat scores in the 2-4 range as indicative,
not precise. The Camino cluster — correctly flagged as highest risk — is where
the map needs the most correction; Douro's core 8-day assignment and the
Alentejo/regional singles are largely sound.

## Verified overlaps

| Keyword A                                                                              | Keyword B                                                         | Share a SERP?                                                                                                                                                                                                                                            | So what                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| camino de santiago bike tours (Hub)                                                    | camino de santiago cycling tours (assigned: French Way from León) | **Yes** — 4 exact URL matches (community.ricksteves.com, bikespain.com/cycling-experiences-bike-tour-camino-santiago/, bicycleadventures.com/tours/camino-de-santiago/, bikeiberia.com/camino/) out of 6-7 results                                       | "cycling tours" is a broad, non-route-specific query — it behaves like a second hub term, not a León-spoke term. Misassigned.                                                                                                                      |
| camino de santiago bike tours (Hub)                                                    | camino de santiago cycling trips (assigned: French Way from León) | Weak/no direct overlap with Hub, but shares 1 URL (followthecamino.com) with "cycling tours" above                                                                                                                                                       | Also broad/generic, dominated by pure-play multi-route Camino specialists (UTracks, Skedaddle, Follow the Camino) with zero topbiketoursportugal.com presence. Same problem as above — not León-specific.                                          |
| camino de santiago bike tours (Hub)                                                    | bike tour porto to santiago de compostela (assigned: Coastal Way) | **No** — 0 shared URLs. Hub SERP = generic multi-route Camino specialists; Coastal Way SERP = Portugal/Camino-specific operators, incl. our own Coastal Way page                                                                                         | Confirms the hub/spoke split itself is structurally sound — broad vs. Portugal-route-specific intent genuinely separate.                                                                                                                           |
| bike tour french camino (assigned: Full French Way/Pyrenees)                           | topbiketoursportugal.com's own French Way **from León** page      | **Yes** — our León tour page (`/tours/bike-tour-camino-de-santiago-cycling-french-way-leon/`) ranks directly in this SERP today                                                                                                                          | Live misassignment: Google already associates this exact phrase with the León page, not the Pyrenees page. Assigning it to Pyrenees creates immediate internal competition against an existing ranking.                                            |
| french way bike tour (assigned: Full French Way/Pyrenees)                              | Camino-specific intent generally                                  | **No meaningful match** — SERP is dominated by generic "France cycling holidays" (Backroads France, DuVine France, Freewheeling France, France Vélo Tourisme) plus a Wikipedia Tour de France disambiguation page; only 1 of 9 results is Camino-related | Bad keyword: Google reads "French Way" as "cycling in France," not "Camino Francés." Won't build topical authority for the Pyrenees page.                                                                                                          |
| portuguese central way bike tour (assigned: Central Way tour page)                     | topbiketoursportugal.com's own blog                               | **Yes** — surfaces `/blog/central-portugal-bike-tours/`, not the Central Way tour page                                                                                                                                                                   | Self-cannibalization already exists: the exact keyword the map assigns to the tour page is currently winning for a different internal URL (a blog post about generic Central Portugal, not the Camino Central Way).                                |
| camino de santiago cycling tour portugal (assigned: Central Way)                       | camino de santiago bike tours (Hub)                               | **Partial** — 2 exact matches (backroads.com/trips/BSTI/…, bikespain.com/cycling-experiences-bike-tour-camino-santiago/)                                                                                                                                 | Ambiguous/borderline (2-3 tier = "interlink," not "same page"). Reads more like a second hub-adjacent query than something a Central-Way-specific page can win outright — keep as a secondary/interlinking keyword, not the page's primary target. |
| douro valley wine country bicycle tour                                                 | douro valley bike tour (both assigned: 8-day Douro page)          | **Yes** — 3 overlaps (portugalbiketours.com/tour/full-day-bike-tour-in-douro-valley/, portugalgreenwalks.com/self-guided-cycling-tour-douro-valley/, near-dup macsadventure tour-3180/holiday-3180)                                                      | Correctly co-assigned to the same page — no action needed.                                                                                                                                                                                         |
| bike touring in douro wine country (assigned: 7-day easy Douro page)                   | 3-day bike tour in douro valley (no product exists)               | **Yes** — 3 exact matches (portugalbiketours.com/tour/douro-cycling-retreat-portugal/, portugalbiketours.com/tour/full-day-bike-tour-in-douro-valley/, portugalnaturetrails.com/tour/douro-valley-by-bike/) — "same cluster" tier                        | If a 3-day product is built (see below), the 7-day-easy page's primary keyword must be differentiated further, or the new 3-day page will cannibalize it.                                                                                          |
| easy douro valley bike tour (assigned: 7-day easy multi-day page)                      | topbiketoursportugal.com's own full-day product                   | **Yes** — surfaces `/tours/douro-valley-full-day-bike-ride/`, a single-day tour outside the 15-page map                                                                                                                                                  | Live self-cannibalization: the "easy" modifier is currently winning for an unrelated single-day product, not the multi-day 7-day-easy page it's assigned to.                                                                                       |
| bike tour alentejo wine country                                                        | bike tour in evora (both assigned: alentejo page)                 | **Yes** — portugalbiketours.com/tour/bike-touring-in-alentejo-wine-country/ appears for both, plus thematic overlap                                                                                                                                      | Correctly co-assigned — no action needed.                                                                                                                                                                                                          |
| bike tour in minho portugal / porto to coimbra bike tour / algarve bike tours portugal | each other, and all Camino/Douro/Alentejo terms                   | **No** in every direction — fully distinct competitor sets per query                                                                                                                                                                                     | Regional singles are correctly isolated from each other and from the other clusters. No cannibalization risk found.                                                                                                                                |

## Corrections

### Critical: "camino de santiago cycling tours" and "camino de santiago cycling trips" are hub-tier terms, not French Way/León spoke terms

Both share heavy URL overlap with the broad hub term "camino de santiago bike
tours" (up to 4 exact matches: Rick Steves forum, Bike Spain, Bicycle
Adventures, Bike Iberia) and show **zero** topbiketoursportugal.com presence
anywhere in the visible results for either. They are non-route-specific —
nothing in either SERP disambiguates Coastal/Central/León/Pyrenees. Move both
off the French Way from León spoke. Either fold them into the hub's target set,
or replace them on the León spoke with genuinely León-specific long-tails (e.g.
"camino de santiago bike tour from leon," "leon to santiago cycling tour") that
were not tested here and should be spot-checked before finalizing.

### Critical: "bike tour french camino" belongs on the León spoke, not the Pyrenees spoke

Google already ranks
`topbiketoursportugal.com/tours/bike-tour-camino-de-santiago-cycling-french-way-leon/`
for this exact phrase today. Assigning it to the Full French Way (Pyrenees) page
as proposed would pit a new optimization effort against an existing, working
ranking signal on a different page — direct self-cannibalization. Reassign "bike
tour french camino" to the French Way from León spoke. Give the Pyrenees page a
different primary term (see next finding).

### High: "french way bike tour" is a weak keyword for the Pyrenees page — replace it

The live SERP reads this phrase as generic "cycling in France" (Backroads
France, DuVine France, Freewheeling France, France Vélo Tourisme, a Wikipedia
Tour de France disambiguation page), not Camino de Santiago. It will not build
topical relevance for the Pyrenees route. "camino frances bike tour" and "saint
jean pied de port bike tour camino" both returned exclusively
Camino-Francés-specific competitor results (10Adventures, 57hours, Follow the
Camino, Santiago Ways, The Natural Adventure) — no topbiketoursportugal.com
presence yet either, but semantically correct territory. Swap "french way bike
tour" for one of these.

### High: "portuguese central way bike tour" currently resolves to the wrong internal page

This keyword surfaces
`topbiketoursportugal.com/blog/central-portugal-bike-tours/` — a generic Central
Portugal blog post — instead of the `santiago-de-compostela-central-way` tour
page it's assigned to in the map. This is an existing internal-cannibalization
case, not a hypothetical one. Either retarget/rename the blog post so it stops
competing on this exact phrase, or accept that the keyword will keep reinforcing
the blog post over the tour page until that's fixed. Consider a more
disambiguated variant for the tour page itself, e.g. "camino central way
portugal bike tour."

### Medium: "camino de santiago cycling tour portugal" is a weak primary keyword for the Central Way spoke

It shares partial overlap (2 exact URLs) with the broad hub SERP and shows no
route-level disambiguation in results (Macs Adventure's general camino-tours
page, a Tripadvisor review, Backroads, Bike Spain, Santiago Ways, an LLride
region page). Keep it as a secondary/interlinking keyword pointing traffic
toward both the hub and the Central Way page rather than treating it as a
page-winning primary target.

### Medium: "3-day bike tour in douro valley" needs a real product, and the 7-day-easy page's keyword needs to be reconsidered alongside it

See the direct answer below — build a bookable 3-day product page. Separately,
because "bike touring in douro wine country" (assigned to the 7-day-easy page)
already shares a same-cluster-tier SERP with the competitor's 3-day product,
once the 3-day page exists, "bike touring in douro wine country" should be
re-evaluated — a broad "wine country" phrase risks pulling traffic to whichever
Douro page looks most relevant to Google, which is not guaranteed to be the
7-day-easy page.

### Medium: "easy douro valley bike tour" is currently winning for the wrong internal page

`topbiketoursportugal.com/tours/douro-valley-full-day-bike-ride/` (a single-day
tour outside the 15-page map) ranks for this term today, not the intended
7-day-easy multi-day page. Before optimizing the 7-day-easy page around this
phrase, either strengthen its "easy" framing enough to overtake the full-day
page internally, or use a duration-qualified variant ("easy 7-day douro valley
bike tour") to reduce ambiguity between the two products.

### Low: No action needed — confirmed-correct co-assignments

"douro valley wine country bicycle tour" + "douro valley bike tour" (8-day page)
and "bike tour alentejo wine country" + "bike tour in evora" (alentejo page)
each show real SERP overlap and are correctly targeting the same page. The three
regional singles (Minho, Porto–Coimbra, Algarve) show no overlap with anything
else in the set and can proceed as mapped.

### Low: Content gap — "self-guided" and "e-bike" modifiers are absent from the map but dominate competitor titling

Nearly every competitor result across the Camino and Douro searches carries a
"self-guided" or "e-bike" modifier in the title (Macs Adventure, Portugal Green
Walks, TerraNova, Tripsite, Portugal Nature Trails). None of the 15 assigned
keywords in this map use either modifier. Worth testing "self-guided" variants
on at least the flagship Coastal Way and 8-day Douro pages as a follow-up, not a
blocking issue for this validation.

## Not assessed

- The 2 remaining keywords per page implied by "3 target keywords per page" for
  the regional singles group — the brief only supplied one keyword each for
  north-of-portugal-en, porto-to-coimbra-biketour, and south-portugal-biketour,
  so their other two assigned keywords were not tested.
- Full pairwise matrix across all ~20 keywords (only high-risk/boundary pairs
  were tested, per the SERP-overlap methodology's pre-grouping and skip rules —
  this is directional coverage, not exhaustive).
- Hub page's own internal competition against the four Camino spokes for
  secondary terms (e.g., does the hub cannibalize Coastal Way for anything
  beyond "camino de santiago bike tours"?) — not tested.
- DataForSEO-grade exact top-10 overlap scoring — unavailable (402); all overlap
  counts above are from WebSearch's 6-9-result snapshots and should be
  re-verified once DataForSEO access is restored.
- PT-language equivalents of any of these keywords.
