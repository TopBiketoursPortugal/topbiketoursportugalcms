/**
 * Last-modified dates for content-backed URLs, read from git.
 *
 * The sitemap shipped 447 URLs with no `lastmod` at all, which left Google no
 * signal about which pages had changed — months after five tours were
 * rewritten it was still serving their old titles and snippets. A commit date
 * per URL is the cheapest accurate signal available.
 *
 * One `git log` call covers the whole content tree; the map is built once and
 * reused for every entry in the sitemap.
 */

import { execFileSync } from 'node:child_process';
import {
  REPO_ROOT,
  collectRoutes,
  PAGINATED,
  TOURS_SEGMENTS
} from './routes.mjs';

let cache = null;

/** file path -> ISO date of the commit that last touched it */
function lastCommitDates() {
  const output = execFileSync(
    'git',
    [
      // Without this, git escapes any path containing a non-ASCII byte —
      // `src/content/blog/E‑Bike-in-Portugal.mdx` (U+2011 non-breaking hyphen,
      // not an ASCII `-`) comes back as the quoted, octal-escaped
      // `"src/content/blog/E\342\200\221Bike-in-Portugal.mdx"`, which matches
      // no route file and silently cost that post and its five translations
      // their lastmod.
      '-c',
      'core.quotepath=false',
      'log',
      '--name-only',
      '--format=%x01%cI',
      '--',
      'src/content',
      'data'
    ],
    { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  );

  const dates = new Map();
  let commitDate = null;

  for (const line of output.split('\n')) {
    if (line.startsWith('\x01')) {
      commitDate = line.slice(1).trim();
      continue;
    }
    const file = line.trim();
    // git log walks newest first, so the first date seen for a file wins.
    if (file && commitDate && !dates.has(file)) dates.set(file, commitDate);
  }

  return dates;
}

/**
 * The taxonomy index pages, which list entries rather than being one.
 *
 * `/tours/tags/` and friends are route-backed, not content-backed, so no file
 * in the content tree carries their date — but they visibly change whenever a
 * taxonomy entry or a tour does, because the page renders each term with a
 * live count of the tours using it. Newest of both collections it reads.
 */
const INDEX_SOURCES = {
  tags: ['tourTags', 'tours'],
  'bike-types': ['bikeCategories', 'tours'],
  'rider-levels': ['tourRiderLevels', 'tours']
};

/**
 * `<language>/<index>` -> lastmod, for the taxonomy index pages above.
 * Built from the same routes/dates pair as the per-URL map.
 */
function indexDates(routes, dates) {
  const byKey = new Map();

  for (const route of routes) {
    const date = dates.get(route.file);
    if (!date) continue;

    for (const [index, collections] of Object.entries(INDEX_SOURCES)) {
      if (!collections.includes(route.collection)) continue;
      const key = `${route.language}/${index}`;
      const current = byKey.get(key);
      if (!current || date > current) byKey.set(key, date);
    }
  }

  return byKey;
}

/**
 * Build `url -> lastmod` for every URL a content entry produces, plus the
 * aggregate pages that no single entry backs.
 * Returns an empty map if git is unavailable, so a build never fails over this.
 */
export function lastmodByUrl() {
  if (cache) return cache;

  try {
    const dates = lastCommitDates();
    const { routes } = collectRoutes();
    const all = [...routes.values()];

    cache = new Map(
      all
        .filter((route) => dates.has(route.file))
        .map((route) => [route.url, dates.get(route.file)])
    );

    for (const [key, date] of indexDates(all, dates)) {
      const [language, index] = key.split('/');
      const prefix = language === 'en' ? '/' : `/${language}/`;
      for (const segment of TOURS_SEGMENTS) {
        cache.set(`${prefix}${segment}/${index}/`, date);
      }
    }
  } catch (error) {
    console.warn(`⚠ sitemap lastmod unavailable (${error.message})`);
    cache = new Map();
  }

  return cache;
}

/** Look up a lastmod for an absolute sitemap URL. */
export function lastmodFor(absoluteUrl) {
  const { pathname } = new URL(absoluteUrl);
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const known = lastmodByUrl().get(path);
  if (known) return known;

  // Page 2+ of a listing has no entry of its own; it is the same listing as
  // page 1, so it changes exactly when page 1 does. Without this the 76
  // paginated tag pages shipped with no recrawl signal at all.
  if (PAGINATED.test(path)) {
    return lastmodByUrl().get(path.replace(/\d+\/$/, ''));
  }

  return undefined;
}
