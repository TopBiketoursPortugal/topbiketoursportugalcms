# Rota — Trip Companion

Companion app for Top Bike Tours Portugal riders. Scaffolded from the product
spec published as the _Rota Trip Companion_ artifact — brand system, OTP auth
flow, competitor teardown, and the 10-tour launch catalogue all trace back to
that document.

Expo SDK 57 · expo-router · TypeScript.

## Run it

The Route tab uses `@maplibre/maplibre-react-native` for the map, live position,
and offline downloads — a native module, so **this app no longer runs in plain
Expo Go.** Build a dev client once, then iterate normally:

```sh
cd mobile-app
npm install
npx expo prebuild            # generates ios/ and android/ (gitignored)
npx expo run:ios             # or: npx expo run:android
```

After that first native build, `npx expo start` and reloading in the dev client
both work as usual — you only re-run `expo prebuild`/`run:*` when a native
dependency changes. `npm run web` still works too (MapLibre ships a web build),
but the map style/offline flow is written and tested against iOS/Android.

`.npmrc` sets `legacy-peer-deps=true` — expo-router's optional web deps (`vaul`,
`@radix-ui/*`) currently conflict under npm's strict resolver; this is upstream,
not specific to anything added here.

### Turn on the map

The Route tab needs a MapLibre style URL — a JSON document pointing at real
vector tiles, not just "use OpenStreetMap." Nothing is hardcoded (see
`src/lib/mapStyle.ts` for why): copy `.env.example` to `.env` and fill in a
style URL from a provider whose terms allow offline downloading, e.g.
[MapTiler](https://www.maptiler.com/) or [Stadia Maps](https://stadiamaps.com/)
(both have a free tier). Without it, the Route tab shows an honest "add a style
URL" empty state instead of a broken map — the turn-by-turn cue list below it
still works either way, once you're on a native build.

### Try the login flow

There's no backend yet, so OTP is mocked in `src/lib/auth.tsx`:

- **Phone:** `+351 912 345 678`
- **Code:** `123456`

That number matches the one mock booking in `src/data/bookings.ts` (Coastal Way,
booking `WT-23175`) — enter any other number and you'll correctly hit the "we
don't see a booking for this number" state, which is the point: a verified phone
alone isn't enough, it has to match a real reservation.

## Structure

```
app/
  _layout.tsx          Font loading, splash, ThemeProvider/AuthProvider,
                        Stack.Protected auth gate
  (auth)/
    login.tsx           Phone entry
    verify.tsx           6-digit OTP entry
  (app)/                 Tabs, only reachable once session exists
    index.tsx             My Trip
    route.tsx              Route & Map — live MapLibre map, offline
                            download, turn-by-turn cue sheet
    elevation.tsx           Elevation
    sightseeing.tsx          Sightseeing
    support.tsx               Support / SOS / sign out

src/
  theme/          Color tokens ported from data/colors.json + global.css,
                   font names, ThemeProvider (light/dark, brand hues in both)
  data/
    tours.ts        The 10-tour launch catalogue, incl. real waypoint coords
    bookings.ts       Mock booking table — stands in for the WeTravel sync
    tracks/             Precomputed real-GPX tracks, one per tour id (null
                          until scripts/gpx-to-track.mjs has one to convert)
  lib/
    auth.tsx           Session state + mocked OTP request/verify
    useMyTour.ts          Booking + tour lookup for the (app) screens
    mapStyle.ts            Resolves EXPO_PUBLIC_MAP_STYLE_URL
    useLiveLocation.ts       Wraps MapLibre's LocationManager/useCurrentPosition
    offlineMap.ts              OfflineManager pack create/find/delete per tour
    geo.ts                       Haversine distance for the stop-to-stop fallback
    routeTrack.ts                 Snap live GPS onto a precomputed GPX track
    directions.ts                  Live ORS cycling route for "Recompute"
  components/     Button, OtpInput, TourCard, ElevationChart, Badge,
                   TurnByTurnCue (fallback), WazeBanner (real turn-by-turn),
                   OffRouteCard (asks before recomputing)
scripts/
  gpx-to-track.mjs  Converts assets/gpx/*.gpx → src/data/tracks/*.json
```

## Brand

Colors, font pairing (Bricolage Grotesque / Figtree / Caveat), and the arched
favicon mark are pulled directly from this repo's own `data/colors.json` and
`src/styles/global.css` — see `src/theme/tokens.ts` for the exact mapping. Dark
mode uses the same hue relationships, not a naive invert.

## The 10 tours

`src/data/tours.ts` carries the distance, duration, elevation gain, and
itinerary stops straight from `src/content/tours/*.mdx` in the main site —
nothing there is invented. Two exceptions:

- `elevationProfile` is an illustrative sparkline shape, used only until a real
  GPX is imported — `scripts/gpx-to-track.mjs` also extracts `<ele>` data into
  `elevation` (250 m samples, smoothed ascent/descent, min/max), and the
  Elevation tab prefers that automatically.
- `waypoints` are real coordinates for each named stop in the tour's own
  itinerary copy, but the line _between_ them on the map is a straight bearing —
  not the actual paved/gravel route a rider follows.

## Offline maps & turn-by-turn

The Route tab is a real, working `@maplibre/maplibre-react-native` map — route
polyline, stop markers, live blue-dot position, and a "Download for offline"
button that calls MapLibre's own `OfflineManager.createPack()` (see
`src/lib/offlineMap.ts`). Tapping **Start tour** switches the camera to follow
the rider (`trackUserLocation="course"`) and reveals live navigation below the
map.

That navigation comes in two modes, and the app is explicit about which one it's
in — it never silently presents the fallback as street-level directions:

- **Street-level, Waze-style (`WazeBanner`)** — "in 300m, turn left" — active
  for any tour with a real ridden GPX imported. See `assets/gpx/README.md` for
  how to add one; short version:
  ```sh
  # drop a GPX named after the tour id into assets/gpx/, then:
  node scripts/gpx-to-track.mjs
  ```
  This precomputes everything **offline, at build time**
  (`src/lib/routeTrack.ts`
  - `scripts/gpx-to-track.mjs`): a thinned track polyline, cumulative distance
    along it, and a maneuver list from bearing-change detection. On-device, the
    live GPS fix is projected onto the nearest track segment (`snapToTrack`) to
    get progress-along-route and an off-route distance — no live routing API
    call, so this keeps working with zero signal once the tour's tiles are
    downloaded, which matters for riders on rural roads.
- **Stop-to-stop cue sheet (`TurnByTurnCue`)** — "next stop, X away" — the
  fallback for any tour without an imported GPX yet. Straight-line distance to
  the next named stop, not real turns.

No map tile URL, key, or bulk-download logic is pointed at a free/public tile
server in this code — see "Turn on the map" above for why, and what to
configure.

### Recompute (off-route)

If a rider drifts more than 60m from the planned track (`OFF_ROUTE_THRESHOLD_M`
in `src/lib/routeTrack.ts`), `WazeBanner` is replaced by `OffRouteCard` — it
**asks** before doing anything, rather than silently guessing or rerouting on
its own. Tapping "Recompute route" is the one thing on this screen that calls a
live API: OpenRouteService's cycling directions (`src/lib/directions.ts`),
routing from the rider's current position back to wherever they were headed on
the plan. The result is drawn as a dashed detour line and takes over the
turn-by-turn banner (tagged "NEW ROUTE") until the rider's live position comes
back within range of the original track, at which point the detour is dropped
automatically.

This needs `EXPO_PUBLIC_ORS_API_KEY` (free tier at
[openrouteservice.org/dev](https://openrouteservice.org/dev/#/signup)) and a
network connection — the only place on the Route tab that does. Without a key,
tapping Recompute explains that instead of failing silently.

## Before this ships

These were flagged in the product spec and still hold:

1. **Real OTP backend.** Replace `src/lib/auth.tsx`'s mock with calls to your
   API, which talks to Twilio Verify (`/Start`, `/VerificationCheck`). Never
   resolve the "correct code" client-side, as this scaffold does.
2. **WeTravel → Rota booking sync.** `src/data/bookings.ts` is a stand-in for
   the webhook/nightly-sync job that should populate a real bookings table keyed
   by `wetravel.uid`.
3. **Real GPX data per tour** — import each tour's ridden GPX (see "Offline maps
   & turn-by-turn" above); one file gives both the real elevation profile and
   street-level turn-by-turn. Only the Coastal Way has one so far.
4. **A production map-tile plan.** Pick a provider (MapTiler/Stadia/ Mapbox),
   budget for the tile+offline-pack volume across 10 regions, and move
   `EXPO_PUBLIC_MAP_STYLE_URL` from a local `.env` into your build pipeline's
   secrets.
5. **App icon / splash.** `assets/*.png` are still Expo's defaults — design
   these from the arched mark in `src/components/BrandMark.tsx`.
6. **Push notifications** (`expo-notifications`) for trip-day reminders — not
   wired up yet.
