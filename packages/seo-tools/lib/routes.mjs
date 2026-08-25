/**
 * Single source of truth for "what public URL does this content file produce?"
 *
 * This mirrors the getStaticPaths() calls in src/pages/** and the helpers in
 * utils/permalinks.ts. If a route's slug rule changes there, change it here too
 * — tools/seo/check-urls.mjs verifies the two agree by diffing against the
 * built sitemap, so a drift shows up as a failing check rather than silently.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, globSync } from 'node:fs';
import { join, posix } from 'node:path';
import slugify from 'slugify';
import { parse as parseYaml } from 'yaml';

/**
 * The site being worked on — the app directory, never this package's own.
 * Every script here runs through the app's `pnpm` scripts (or from
 * astro.config.ts), so the working directory is the app root and its
 * `data/`, `src/content/` and `dist/` are what we read.
 */
export const REPO_ROOT = process.cwd();

/**
 * Where the app sits inside the git repository — `apps/<name>/` in the
 * monorepo, `` when an app is the repository root. `git log` prints paths
 * relative to the repository, not to the app, so everything that matches git
 * output against a content file has to strip this first.
 */
export const GIT_PREFIX = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--show-prefix'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
})();

/** A repository-relative path from git output -> app-relative path. */
export const stripGitPrefix = (path) =>
  GIT_PREFIX && path.startsWith(GIT_PREFIX)
    ? path.slice(GIT_PREFIX.length)
    : path;

/**
 * Optional data/seo.json:
 *
 *   { "historyRoots": ["src/content", "data"] }
 *
 * Repository-relative folders this app's content used to live in before it
 * moved to its current place. The bike site was the repository root until the
 * monorepo split, so its slug history and last-modified dates are under the
 * top-level `src/content` in older commits; listing that here keeps them.
 * A site with no such past leaves the file out.
 */
export const HISTORY_ROOTS = (() => {
  const path = join(REPO_ROOT, 'data/seo.json');
  if (!existsSync(path)) return [];
  const roots = JSON.parse(readFileSync(path, 'utf8')).historyRoots ?? [];
  return roots.map((root) => root.replace(/\/+$/, ''));
})();

/**
 * git pathspecs for the app's content folders (app-relative, e.g.
 * `src/content`, `data`) plus every historical root from data/seo.json.
 * `:(top)` anchors each one at the repository root regardless of cwd.
 */
export function gitPathspecs(folders) {
  const current = folders.map((folder) => `${GIT_PREFIX}${folder}`);
  return [...new Set([...current, ...HISTORY_ROOTS])].map(
    (path) => `:(top)${path}`
  );
}

const PERMALINKS = JSON.parse(
  readFileSync(join(REPO_ROOT, 'data/permalinks.json'), 'utf8')
);

/** data/languages.json — code, hreflang locale, display name per language. */
export const LANGUAGES_DATA = JSON.parse(
  readFileSync(join(REPO_ROOT, 'data/languages.json'), 'utf8')
);

export const LANGUAGES = Object.keys(LANGUAGES_DATA);
export const DEFAULT_LANGUAGE =
  Object.values(LANGUAGES_DATA).find((l) => l.isDefault)?.code ?? 'en';

/** The exact slugify options every getStaticPaths() in src/pages uses. */
export const slug = (value) =>
  slugify(String(value ?? ''), { lower: true, strict: true, trim: true });

const base = (language) => (language === 'en' ? '/' : `/${language}/`);
const toursSeg = (language) => PERMALINKS.tours[language] ?? 'tours';

/** Every locale's tours segment, for matching a built URL back to a route. */
export const TOURS_SEGMENTS = [
  ...new Set(LANGUAGES.map((language) => toursSeg(language)))
];

/**
 * Page 2+ of a paginated listing: `/blog/3/`, `/pt/blog/tags/algarve/2/`.
 *
 * Page 1 has no number, so a trailing numeric segment is always a later page.
 * The shape is pinned to the blog listing routes rather than "ends in a digit"
 * because plenty of real slugs do (`costa-da-prata-2`, `trek-dual-sport-1`).
 *
 * Shared because two SEO signals key off it: these pages carry no hreflang
 * (tools/seo/lib/alternates.mjs — the translations run to different page
 * counts, so there is no equivalent page to point at) and they take their
 * lastmod from page 1 (tools/seo/lib/lastmod.mjs — no content entry backs
 * them). One definition so the two cannot disagree about what page 2 is.
 */
export const PAGINATED = /^\/(?:[a-z]{2}\/)?blog\/(?:tags\/[^/]+\/)?\d+\/$/;

/**
 * Route definitions, keyed by collection. `dir` is relative to src/content;
 * translated entries live in a `<lang>/` subdirectory of the same folder.
 *
 * `url(fm, language)` returns the public path, always with a trailing slash.
 * `slugFrom` lists the frontmatter fields consulted, in precedence order —
 * url-history.mjs replays historical values of exactly these fields.
 */
export const COLLECTIONS = {
  tours: {
    dir: 'tours',
    slugFrom: ['path', 'title'],
    url: (fm, lang) =>
      `${base(lang)}${toursSeg(lang)}/${slug(fm.path ?? fm.title)}/`
  },
  tourRegions: {
    dir: 'tour-regions',
    slugFrom: ['path', 'name', 'title'],
    url: (fm, lang) =>
      `${base(lang)}${toursSeg(lang)}/regions/${slug(fm.path ?? fm.name ?? fm.title)}/`
  },
  tourTags: {
    dir: 'tour-tags',
    slugFrom: ['path', 'name', 'title'],
    url: (fm, lang) =>
      `${base(lang)}${toursSeg(lang)}/tags/${slug(fm.path ?? fm.name ?? fm.title)}/`
  },
  tourRiderLevels: {
    dir: 'tour-rider-levels',
    slugFrom: ['path', 'name', 'title'],
    url: (fm, lang) =>
      `${base(lang)}${toursSeg(lang)}/rider-levels/${slug(fm.path ?? fm.name ?? fm.title)}/`
  },
  bikeCategories: {
    dir: 'bike-categories',
    slugFrom: ['path', 'name', 'title'],
    url: (fm, lang) =>
      `${base(lang)}${toursSeg(lang)}/bike-types/${slug(fm.path ?? fm.name ?? fm.title)}/`
  },
  blog: {
    dir: 'blog',
    slugFrom: ['path', 'title'],
    url: (fm, lang) => `${base(lang)}blog/${slug(fm.path ?? fm.title)}/`
  },
  postTags: {
    dir: 'blog-tags',
    slugFrom: ['path', 'name', 'title'],
    url: (fm, lang) =>
      `${base(lang)}blog/tags/${slug(fm.path ?? fm.name ?? fm.title)}/`
  },
  team: {
    // team/[path].astro slugifies the title only — `path` is ignored there.
    dir: 'team',
    slugFrom: ['title'],
    url: (fm, lang) => `${base(lang)}team/${slug(fm.title)}/`
  },
  pages: {
    dir: 'pages',
    slugFrom: ['path', 'title'],
    url: (fm, lang, file) => {
      const value = fm.path ?? fm.title;
      if (
        value === 'index' ||
        value === 'home' ||
        /index\.mdx?$/.test(file ?? '')
      ) {
        return base(lang);
      }
      return `${base(lang)}${slug(value).replace(/index$/, '')}/`.toLowerCase();
    }
  }
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/** Parse frontmatter. Returns null for files without a frontmatter block. */
export function readFrontmatter(source, label = '<memory>') {
  const match = FRONTMATTER.exec(source);
  if (!match) return null;
  try {
    return parseYaml(match[1]) ?? {};
  } catch (error) {
    throw new Error(`Invalid YAML frontmatter in ${label}: ${error.message}`, {
      cause: error
    });
  }
}

/** Language implied by a content path: src/content/<dir>/<lang>/... */
export function languageFromPath(relativePath) {
  const segments = relativePath.split('/');
  const found = segments.find((segment) => LANGUAGES.includes(segment));
  return found ?? 'en';
}

/** Which collection a src/content path belongs to, or null if it is not routable. */
export function collectionFromPath(relativePath) {
  const withoutPrefix = relativePath.replace(/^src\/content\//, '');
  const dir = withoutPrefix.split('/')[0];
  for (const [name, config] of Object.entries(COLLECTIONS)) {
    if (config.dir === dir) return name;
  }
  return null;
}

/**
 * Every public URL the current working tree produces, keyed by
 * `<collection>:<language>:<frontmatter id>` — the identity that survives a
 * slug change. Language is part of the key because taxonomy entries reuse the
 * same `id` across translations (that is how a tour resolves its region in
 * both languages), so id alone is not unique.
 */
export function collectRoutes(root = REPO_ROOT) {
  const routes = new Map();
  const problems = [];

  for (const [collection, config] of Object.entries(COLLECTIONS)) {
    const pattern = posix.join('src/content', config.dir, '**/*.{md,mdx}');
    for (const match of globSync(pattern, { cwd: root })) {
      const relativePath = match.split(/[\\/]/).join('/');
      // Only this collection's own folder — not a nested collection's files.
      if (collectionFromPath(relativePath) !== collection) continue;

      const source = readFileSync(join(root, relativePath), 'utf8');
      const frontmatter = readFrontmatter(source, relativePath);
      if (!frontmatter) {
        problems.push({ file: relativePath, reason: 'no frontmatter block' });
        continue;
      }

      // Unpublished translation stubs produce no route — src/schemas/
      // published-glob.ts drops them from the collections for the same reason.
      if (frontmatter.draft === true) continue;

      const language = frontmatter.language ?? languageFromPath(relativePath);
      const url = config.url(frontmatter, language, relativePath);
      const id = frontmatter.id;

      if (!id) {
        problems.push({
          file: relativePath,
          reason: 'missing `id` in frontmatter'
        });
        continue;
      }

      const key = `${collection}:${language}:${id}`;
      if (routes.has(key)) {
        problems.push({
          file: relativePath,
          reason: `duplicate id "${id}" — also used by ${routes.get(key).file}`
        });
        continue;
      }

      // Which frontmatter field actually supplied the slug. The templates use
      // `fm.path ?? fm.title`, so a field that is present but blank still wins
      // the `??` and yields an empty slug — treat blank as absent here so the
      // reported source matches what a reader would call the source.
      const slugField =
        config.slugFrom.find(
          (field) => String(frontmatter[field] ?? '').trim() !== ''
        ) ?? null;

      routes.set(key, {
        key,
        collection,
        id,
        language,
        url,
        file: relativePath,
        title: frontmatter.title ?? null,
        // `seo.no_index` drives the robots meta tag on the page. A URL that
        // tells Google not to index it has no business being advertised in
        // the sitemap — see noindexUrlSet below.
        noIndex: frontmatter.seo?.no_index === true,
        slugField,
        slugPreferred: config.slugFrom[0]
      });
    }
  }

  return { routes, problems };
}

/** The set of URLs currently served, for collision checks. */
export function liveUrlSet(routes) {
  return new Set([...routes.values()].map((route) => route.url));
}

/**
 * Paths whose page renders `<meta name="robots" content="noindex">`.
 *
 * Listing a noindex URL in the sitemap is a contradictory signal: the sitemap
 * asks Google to crawl and index it, the page says not to. `/thank-you-page/`
 * shipped both for months. Paths (not absolute URLs) because that is what the
 * sitemap integration's `filter` is easiest to compare against.
 */
export function noindexPathSet(root = REPO_ROOT) {
  const { routes } = collectRoutes(root);
  return new Set(
    [...routes.values()].filter((route) => route.noIndex).map((r) => r.url)
  );
}

/** Normalise a routing.json path for comparison (always one trailing slash). */
export function normalisePath(value) {
  if (!value) return value;
  const [path] = value.split('#');
  if (path.startsWith('http')) return path;
  return path.endsWith('/') ? path : `${path}/`;
}
