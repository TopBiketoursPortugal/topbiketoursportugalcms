# Top Tours Portugal — monorepo

One pnpm workspace, three apps, a thin layer of shared packages.

```
apps/
  topbiketoursportugal/          Astro site — topbiketoursportugal.com (6 locales)
  topwalkingtoursportugal/       Astro site — topwalkingtoursportugal.com (en, pt)
  topbiketoursportugal-mobile/   Expo / React Native trip-companion app ("Rota")
packages/
  schemas/      @ttp/schemas   content-collection schemas both sites build on
  data/         @ttp/data      reference data identical across sites (countries)
  seo-tools/    @ttp/seo-tools redirect / sitemap / post-build SEO checks
```

Each web app owns its content (`src/content`), its brand and site data
(`data/*.json`), its assets, its CloudCannon configuration and its Netlify
deploy. What is shared is _shape_, not content: the zod schemas every collection
validates against, the SEO tooling, and the lint/format/tsconfig setup at the
repo root.

## Working on it

```sh
pnpm install                 # once, at the root
pnpm dev                     # bike site      (= pnpm --filter topbiketoursportugal dev)
pnpm dev:walking             # walking site
pnpm dev:mobile              # expo start
pnpm build                   # bike site: astro build + seo:check + seo:audit
pnpm build:walking
pnpm lint                    # every workspace package
```

Every app script (`pnpm --filter <app> <script>`) runs with that app as the
working directory; the shared SEO tools read `data/`, `src/content/` and `dist/`
from there.

## Shared packages

- **`@ttp/schemas`** exports factories, not finished collections — each app
  passes in its own locale union (`createLanguageSchema(['en', 'pt'])`) and, for
  tours, any site-specific fields (`extend: { bikeCategories: … }`). See
  `apps/*/src/schemas/*.ts` and `src/content.config.ts` for the wiring.
- **`@ttp/seo-tools`** exposes `ttp-seo-check`, `ttp-seo-audit`, `ttp-seo-urls`,
  `ttp-mdx-clone`, `ttp-validate-blog` as bins, plus
  `lib/{routes,alternates,lastmod}.mjs` for `astro.config.ts`. An app that moved
  inside the repo lists its former locations in `data/seo.json` (`historyRoots`)
  so slug history and last-modified dates survive the move.

## Deploying

Netlify and CloudCannon each point at one app directory as their base
(`apps/topbiketoursportugal` or `apps/topwalkingtoursportugal`); the per-app
`netlify.toml`, `cloudcannon.config.yml` and `.cloudcannon/` scripts live there.
The lockfile and `pnpm-workspace.yaml` stay at the repo root, so the install
command on both platforms is a plain `pnpm install` run from the app directory
(pnpm finds the workspace root on its own).
