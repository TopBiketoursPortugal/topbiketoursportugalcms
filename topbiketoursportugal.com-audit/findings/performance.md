## Score: 38/100

Weighted toward mobile (Lighthouse 13.4.1 lab scores: home 58, tour 38, blog 40
mobile; home 63, tour 50 desktop). The highest-converting page (tour, 6.7% CVR)
is the worst performer at 38/100 mobile, which is why the overall score is
pulled down rather than averaged evenly.

## Measurements

**All figures below are LAB data from Lighthouse 13.4.1 CLI runs against the
live site (2026-08-13), not CrUX field data.** The plugin's Google API
credentials are not configured, so real-user (CrUX) percentiles could not be
pulled for this audit — field pass/fail verdicts below are inferred from lab
magnitude, not measured directly. Mobile runs used Lighthouse's default
simulated mobile throttling (4x CPU slowdown + simulated slow 4G); desktop runs
used the desktop preset.

| Page                             | Strategy | Perf Score            | LCP                       | CLS           | TBT (INP proxy) | Max Potential FID (INP proxy) |
| -------------------------------- | -------- | --------------------- | ------------------------- | ------------- | --------------- | ----------------------------- |
| Homepage `/`                     | Mobile   | 58                    | 3.0 s (Needs Improvement) | 0.002 (Good)  | 5,960 ms        | 618 ms                        |
| Homepage `/`                     | Desktop  | 63                    | 2.7 s (Needs Improvement) | 0.012 (Good)  | 480 ms          | 135 ms                        |
| Tour: Porto–Santiago Coastal Way | Mobile   | 38                    | **17.6 s (Poor)**         | 0.0005 (Good) | **8,080 ms**    | **1,738 ms**                  |
| Tour: Porto–Santiago Coastal Way | Desktop  | 50                    | 3.8 s (Needs Improvement) | 0.034 (Good)  | 910 ms          | 247 ms                        |
| Blog: Cycling Douro Valley Guide | Mobile   | 40                    | **17.7 s (Poor)**         | 0.007 (Good)  | 2,820 ms        | 356 ms                        |
| Blog: Cycling Douro Valley Guide | Desktop  | _not tested this run_ | —                         | —             | —               | —                             |

Lighthouse's lab tool does not emit a true INP value (INP requires real
interaction sampling from field data); Total Blocking Time and Max Potential FID
are used here as the standard lab proxies for interactivity risk. TBT in the
thousands of milliseconds under simulated mobile throttling is a strong signal
that real-user INP will be poor, especially for the tour and homepage.

## Findings

### Critical: Tour page mobile LCP is 17.6s — driven by main-thread contention, not the hero image

On `/tours/porto-santiago-compostela-bike-tour-coastal-way/` (mobile), the LCP
element is `header.relative > div.overflow-clip > picture > img.w-full` (the
"Porto to Santiago de Compostela Bike Tour" hero,
`the-way-of-st.-james-bike-tour-fold-n-visit-cycling-holidays-3582…`). The image
itself is configured correctly — `fetchpriority="high"`, explicit
`width="1280" height="853"`, present in initial HTML (not lazy-loaded) — so it
is not the direct cause. Lighthouse's LCP-subpart breakdown only accounts for
~2.47s (TTFB 294ms + resource load delay 189ms + resource load duration
1,500ms + element render delay 486ms), yet the reported LCP metric is 17.6s.
That ~15s gap, combined with 8,080ms of Total Blocking Time across 20 long tasks
and 15.8s of main-thread scripting work (`mainthread-work-breakdown` score 0),
means JavaScript execution competing for the main thread is what's actually
delaying paint of an otherwise well-configured image. This is the
highest-converting page on the site (6.7% CVR) — this is the single
highest-priority fix on the site.

### Critical: Blog page mobile LCP is 17.7s — same main-thread-blocking pattern

On `/blog/cycling-douro-valley-guide/` (mobile), the LCP element is the article
hero `img.aspect-video` (`/_astro/douro-valley.DIuecyG2_nesyr.webp`), which is
also correctly configured (`fetchpriority="high"`, `width="512" height="341"`,
`decoding="async"`, present in HTML). The subpart breakdown sums to only ~1.31s
(TTFB 150ms + load delay 86ms + load duration 401ms + render delay 674ms)
against a 17.7s reported LCP. Total Blocking Time is 2,820ms with 6.8s of
main-thread scripting. As with the tour page, the image pipeline (jampack) is
not the bottleneck — main-thread JavaScript is blocking the paint step long
after the image itself is ready.

### High: Tour and homepage mobile Total Blocking Time indicates near-certain INP failures in the field

Mobile TBT is 8,080ms on the tour page and 5,960ms on the homepage (20 long
tasks each, per `long-tasks`/`mainthread-work-breakdown`), with Max Potential
FID of 1,738ms and 618ms respectively — both far past the 500ms "Poor" INP
threshold. Any tap on the hamburger menu, tour gallery thumbnails, or booking
CTA while these long tasks are running will register as a slow interaction for
mobile users, who convert at 2.7x the rate of desktop visitors (1.78% vs 0.65%
CTR) — this is a direct conversion-rate risk, not just a Lighthouse score issue.
`third-parties-insight` and `legacy-javascript-insight` both passed (score 1) on
all three pages, and `duplicated-javascript-insight` also passed, which rules
out third-party scripts and legacy-polyfill bloat as the cause — the blocking
work is coming from first-party JS execution (page hydration/interactive
components) and needs to be profiled directly in DevTools Performance panel to
name the specific script/task, which this pass did not drill into (see "Not
assessed").

### High: Homepage's mobile LCP element is a text paragraph, not the hero image

On `/` (mobile), the LCP node is `div.flex > div.subheading-text > div.flex > p`
— the "Top Bike Tours Portugal is a Porto-based operator offering guided and
self-guid…" paragraph — not an image. Its element render delay is 233ms of the
3.0s total LCP. A text-based LCP element commonly indicates either (a) a web
font blocking text paint (FOIT) ahead of this element, or (b) render-blocking
CSS/JS delaying first paint of this section. Confirm `font-display: swap` (the
`font-display-insight` audit passed overall, so this is likely CSS/JS
render-blocking rather than font FOIT) and check what precedes this paragraph in
the critical rendering path.

### Medium: `forced-reflow-insight` fails on all three pages

All three pages (home, tour, blog) fail Lighthouse's forced-reflow insight,
meaning JavaScript is querying geometric properties (e.g., `offsetWidth`,
`getBoundingClientRect`) after the DOM/styles have been invalidated, forcing a
synchronous layout recalculation on the main thread. This compounds the TBT/INP
problems above. The specific script triggering this was not isolated in this
pass — needs a DevTools Performance trace to name the exact call site (see "Not
assessed").

### Medium: `network-dependency-tree-insight` fails on all three pages

All three pages show a critical-request dependency chain that Lighthouse flags
as too long, adding to `resourceLoadDelay` in the LCP breakdown (visible as
189ms on the tour page and 86ms on the blog page). Likely candidates given the
stack are render-blocking CSS pulling in further chained requests (fonts, or
Astro-generated critical CSS) before the LCP resource can start loading — needs
the raw `network-dependency-tree-insight` chain items to name the exact
resources (not pulled in this pass).

### Medium: `cache-insight` scores 0.5 (partial) on all three pages

Despite static hosting on Netlify's edge/CDN, at least some requested resources
have suboptimal cache lifetimes. Given the jampack image pipeline outputs
content-hashed filenames, hashed assets (JS/CSS/images under `/_astro/`) should
be served with `Cache-Control: public, max-age=31536000, immutable`; anything
scoring below full marks here is worth checking against Netlify's default
headers/`netlify.toml` `[[headers]]` rules for non-hashed or HTML-adjacent
assets.

### Medium: `render-blocking-insight` fails on the blog page specifically (passes on home and tour)

Only the blog template fails the render-blocking-requests check; home and tour
pass. This points to something in the blog layout/partial (e.g., a stylesheet or
script included only on blog pages — possibly Pagefind's CSS/JS, syntax
highlighting, or a related-posts widget) blocking initial render. The specific
offending URL was not isolated in this pass (see "Not assessed").

### Low: CLS is excellent across all three page types — no action needed

CLS is 0.002 (home mobile), 0.012 (home desktop), 0.0005 (tour mobile), 0.034
(tour desktop), and 0.007 (blog mobile) — all comfortably under the 0.1 "Good"
threshold. `cls-culprits-insight` passed on all pages. Images throughout
(including the tour hero and blog hero) carry explicit `width`/`height`
attributes, and no evidence of late-injected content shifting layout was found.
This is not a priority area.

### Low: Desktop LCP is "Needs Improvement" on homepage (2.7s) and tour (3.8s)

Both fall short of the 2.5s "Good" desktop LCP bar but are far from "Poor."
Desktop TBT/Max Potential FID are comparatively low (135ms and 247ms
respectively, both "Good"), so desktop interactivity is not currently a concern
— only the LCP timing on these two page types needs incremental improvement
(likely resolved as a side effect of fixing the mobile main-thread contention
above, since server TTFB is already fast at ~40-80ms on every page/strategy
tested).

## Not assessed

- **CrUX field data (75th percentile, real users)** — plugin Google API
  credentials are not configured, so this audit is lab-only. Field pass/fail
  (the metric Google actually uses for ranking/Search Console CWV report) is
  unverified; lab numbers here are directional, not authoritative.
- **True INP** — Lighthouse cannot measure INP in a single automated page load
  (it requires a real user interaction sample). TBT and Max Potential FID were
  used as proxies; get real INP from CrUX or a RUM tool (web-vitals.js) once
  available.
- **Exact script/task responsible for the 8,080ms (tour) / 5,960ms (home) /
  2,820ms (blog) of blocking time** — main-thread work breakdown and long-task
  counts were captured, but a full trace was not drilled into script-attribution
  level in this pass. Needs a DevTools Performance panel trace with
  bottom-up/call-tree analysis, or the `script-treemap-data` /
  `network-requests` audit contents from the saved Lighthouse JSON (already
  captured, not yet parsed).
- **`forced-reflow-insight`, `network-dependency-tree-insight`,
  `render-blocking-insight` (blog), `image-delivery-insight` item-level detail**
  — these insights failed/partially-failed on one or more pages, but the
  specific offending resource/selector list within each was not extracted before
  this report was due; the raw `details.items` are present in the saved
  Lighthouse JSON files and can be parsed for exact culprits.
- **Blog page desktop run** — only mobile was tested for the blog page in this
  pass.
- **Tour page gallery/map lazy-loading behavior beyond the hero image** —
  confirmed the LCP hero image on the tour page loads eagerly and correctly;
  below-the-fold gallery images and any embedded map were not individually
  inspected for correct `loading="lazy"`/dimension attributes in this pass.
- **Impressions discrepancy** — the brief states "mobile is the majority of
  impressions" alongside figures showing desktop (128,246) exceeding mobile
  (67,594); this audit did not attempt to reconcile that and treated mobile as
  business-critical regardless, based on its 2.7x higher CTR.

Raw Lighthouse JSON reports (home/tour/blog, mobile+desktop where run) are saved
at:
`/tmp/claude-1000/-home-nflcosta-projects-topbiketoursportugalcms/eb27d3f4-7825-430c-86a0-06699b76d1a9/scratchpad/lh/`
