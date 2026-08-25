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
import { statSync } from 'node:fs';
import { join } from 'node:path';
import {
  REPO_ROOT,
  collectRoutes,
  PAGINATED,
  TOURS_SEGMENTS,
  gitPathspecs,
  stripGitPrefix
} from './routes.mjs';

let cache = null;

/**
 * file path -> ISO date of the commit that last *changed* it.
 *
 * A pure rename is not a change: when the site moved into `apps/` every
 * content file was "touched" by that one commit, and reporting its date for
 * all 1,300 URLs would tell Google the whole site changed at once — the
 * opposite of the signal this exists to give. So renames with no content
 * change (`R100`) are followed back to the file's previous name instead.
 */
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
      '--name-status',
      '-M',
      '--format=%x01%cI',
      '--',
      ...gitPathspecs(['src/content', 'data'])
    ],
    { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  );

  const dates = new Map();
  // old name -> the name that file goes by now (git log walks newest first,
  // so a rename is seen before the history under the old name).
  const renamedTo = new Map();
  const current = (file) => {
    let name = file;
    for (let hops = 0; renamedTo.has(name) && hops < 64; hops++) {
      name = renamedTo.get(name);
    }
    return name;
  };
  let commitDate = null;

  for (const line of output.split('\n')) {
    if (line.startsWith('\x01')) {
      commitDate = line.slice(1).trim();
      continue;
    }
    if (!line.trim() || !commitDate) continue;

    const [status, ...paths] = line.split('\t');
    const kind = status[0];
    let file;

    if (kind === 'R' || kind === 'C') {
      const from = stripGitPrefix(paths[0]);
      const to = stripGitPrefix(paths[1]);
      if (from !== to) renamedTo.set(from, to);
      // R100: same bytes, new name — not a modification. Anything less was
      // edited in the same commit, so this commit is its lastmod.
      if (kind === 'R' && status === 'R100') continue;
      file = to;
    } else {
      file = stripGitPrefix(paths[0]);
    }

    const name = current(file);
    // The first date seen for a file wins.
    if (!dates.has(name)) dates.set(name, commitDate);
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

    // A file git has never seen (new content not yet committed) still has a
    // best-available date: its modification time. Without this a site whose
    // content was just imported would ship a sitemap with no lastmod at all.
    for (const route of all) {
      if (dates.has(route.file)) continue;
      try {
        dates.set(
          route.file,
          statSync(join(REPO_ROOT, route.file)).mtime.toISOString()
        );
      } catch {
        // Unreadable file: leave it without a date rather than guess.
      }
    }

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
