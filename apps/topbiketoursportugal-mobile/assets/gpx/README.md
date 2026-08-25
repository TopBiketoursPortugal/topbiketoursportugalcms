# Real ridden GPX tracks

Drop a real ridden GPX export here, named after the tour id it belongs to (see
`id:` in `src/data/tours.ts`), e.g.:

```
coastal-way-santiago.gpx
douro-valley-wine.gpx
```

Then run:

```sh
node scripts/gpx-to-track.mjs
```

That converts each file into `src/data/tracks/<tourId>.json` — a precomputed
polyline, cumulative distances, and turn-by-turn maneuver list used by the Route
tab's Waze-style banner (`src/components/WazeBanner.tsx`). Commit the generated
`.json`, not the raw `.gpx` file it came from, unless you also want the source
track kept in the repo.

Tours without a file here keep the straight-line stop-to-stop cue sheet as a
fallback — the app is explicit about which mode it's in, never silently presents
the fallback as street-level directions.

Any standard export (Garmin Connect, Strava, Komoot, RideWithGPS) works — the
parser just reads `<trkpt lat="" lon="">` points.
