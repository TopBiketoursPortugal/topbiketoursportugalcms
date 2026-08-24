# GPX tracks

Route files downloaded from guide pages (`page-sections/guide/route-profile`
block, `gpxFile` field).

## Naming convention

```
<guide-slug>-<route>.gpx
```

- `<guide-slug>` is the guide's `path` (e.g. `porto-to-lisbon-by-bike`).
- `<route>` is a short kebab-case name for the ride or stage (e.g. `coastal`,
  `stage-3`, `full-route`).

Examples: `porto-to-lisbon-by-bike-full-route.gpx`,
`cycling-the-algarve-ecovia.gpx`.

Reference the file from frontmatter as `gpxFile: /gpx/<guide-slug>-<route>.gpx`.
The download button only renders when the field is set, so leave it empty until
the file exists here.
