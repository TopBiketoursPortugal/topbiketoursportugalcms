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
import { REPO_ROOT, collectRoutes } from './routes.mjs';

let cache = null;

/** file path -> ISO date of the commit that last touched it */
function lastCommitDates() {
  const output = execFileSync(
    'git',
    ['log', '--name-only', '--format=%x01%cI', '--', 'src/content', 'data'],
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
 * Build `url -> lastmod` for every URL a content entry produces.
 * Returns an empty map if git is unavailable, so a build never fails over this.
 */
export function lastmodByUrl() {
  if (cache) return cache;

  try {
    const dates = lastCommitDates();
    const { routes } = collectRoutes();
    cache = new Map(
      [...routes.values()]
        .filter((route) => dates.has(route.file))
        .map((route) => [route.url, dates.get(route.file)])
    );
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
  return lastmodByUrl().get(path);
}
