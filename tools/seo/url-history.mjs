#!/usr/bin/env node
/**
 * Derive a 301 for every URL this site has ever published.
 *
 * The problem this exists to solve: a tour's URL comes from its `path`
 * frontmatter field, which is editable in CloudCannon. Editing it publishes a
 * new URL and silently abandons the old one — five tours were renamed that way
 * between April and June 2026, and each rename reset the page's search history.
 *
 * Rather than trusting anyone to hand-write the redirect afterwards, this
 * replays git history for every routable content file, reconstructs every URL
 * those files have ever produced, and writes a redirect from each one to the
 * file's current URL.
 *
 * Output: data/url-history.json — committed, so builds do not depend on having
 * full git history available. astro.config.ts merges it into dist/_redirects
 * underneath data/routing.json, which stays hand-editable and wins on conflict.
 *
 *   node tools/seo/url-history.mjs            regenerate the file
 *   node tools/seo/url-history.mjs --check    exit 1 if it is out of date
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  REPO_ROOT,
  COLLECTIONS,
  collectRoutes,
  liveUrlSet,
  redirectedRoutes,
  collectionFromPath,
  languageFromPath
} from './lib/routes.mjs';

const OUTPUT = join(REPO_ROOT, 'data/url-history.json');
const check = process.argv.includes('--check');

/** Fields whose historical values can have produced a URL. */
const SLUG_FIELDS = new Set(
  Object.values(COLLECTIONS).flatMap((config) => config.slugFrom)
);

/**
 * Also tracked, but not as a slug source: `id` is the stable identity that
 * survives a file rename, so it is how a historical file is matched to the
 * page it is today. Git's own rename detection is not reliable enough here —
 * CloudCannon rewrites enough of a file that similarity detection misses it.
 */
const TRACKED_FIELDS = new Set([...SLUG_FIELDS, 'id']);

function git(args) {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024
  });
}

function hasFullHistory() {
  try {
    return git(['rev-parse', '--is-shallow-repository']).trim() === 'false';
  } catch {
    return false;
  }
}

/** Unquote a YAML scalar as written on a single frontmatter line. */
function scalar(raw) {
  const value = raw.trim();
  if (
    (value.startsWith("'") && value.endsWith("'") && value.length > 1) ||
    (value.startsWith('"') && value.endsWith('"') && value.length > 1)
  ) {
    return value.slice(1, -1);
  }
  // Unterminated quote — CloudCannon writes these when a value contains a
  // newline. Take what is on this line; slugify discards the rest anyway.
  return value.replace(/^['"]/, '');
}

/**
 * Walk `git log -p` once over src/content and collect, per file, every value
 * any slug-determining field has ever held.
 */
function historicalFieldValues() {
  const log = git([
    'log',
    '-p',
    '-M',
    '--no-color',
    '--format=%x01%H',
    '--',
    'src/content'
  ]);

  const perFile = new Map(); // file -> Map<field, Set<value>>
  const renames = new Map(); // old path -> new path
  let file = null;
  let renameFrom = null;

  for (const line of log.split('\n')) {
    if (line.startsWith('\x01')) {
      file = null;
      continue;
    }
    if (line.startsWith('diff --git ')) {
      const match = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
      file = match ? match[2] : null;
      renameFrom = null;
      continue;
    }
    if (line.startsWith('rename from ')) {
      renameFrom = line.slice('rename from '.length);
      continue;
    }
    if (line.startsWith('rename to ') && renameFrom) {
      renames.set(renameFrom, line.slice('rename to '.length));
      renameFrom = null;
      continue;
    }
    if (!file || !line.startsWith('+') || line.startsWith('+++')) continue;

    const match = /^\+([A-Za-z_]+):\s*(\S.*)$/.exec(line);
    if (!match) continue;
    const [, field, raw] = match;
    if (!TRACKED_FIELDS.has(field)) continue;

    if (!perFile.has(file)) perFile.set(file, new Map());
    const fields = perFile.get(file);
    if (!fields.has(field)) fields.set(field, new Set());
    fields.get(field).add(scalar(raw));
  }

  return { perFile, renames };
}

/** Follow a rename chain to the path a historical file ended up at. */
function resolveRenames(path, renames, seen = new Set()) {
  let current = path;
  while (renames.has(current) && !seen.has(current)) {
    seen.add(current);
    current = renames.get(current);
  }
  return current;
}

/**
 * Hand-written rules in data/routing.json are authoritative. Reading them here
 * lets the generator stay out of their way: it never emits a rule that would
 * duplicate one, chain onto one, or point back at one's source (which would be
 * a redirect loop).
 */
function manualRules() {
  const path = join(REPO_ROOT, 'data/routing.json');
  if (!existsSync(path)) return { sources: new Set(), destinations: new Set() };
  const { routes = [] } = JSON.parse(readFileSync(path, 'utf8'));
  const slash = (value) =>
    value && !value.startsWith('http') && !value.endsWith('/')
      ? `${value}/`
      : value;
  return {
    sources: new Set(routes.map((rule) => slash(rule.from))),
    destinations: new Set(routes.map((rule) => slash(rule.destination)))
  };
}

function build() {
  const { routes, problems } = collectRoutes();
  const live = liveUrlSet(routes);
  const byFile = new Map(
    [...routes.values()].map((route) => [route.file, route])
  );
  const manual = manualRules();
  // URLs of entries retired with `redirect_to`: astro.config.ts already 301s
  // these, so they are neither lost nor in need of a generated rule.
  const retiredRules = redirectedRoutes();
  const retired = new Set(retiredRules.map((rule) => rule.from));
  // A retired entry still owns its historical slugs: each of them should land
  // where the entry's own `redirect_to` points, in one hop — Netlify follows
  // a single rule, so pointing them at the retired URL would 404.
  const retiredByKey = new Map();
  const retiredByFile = new Map();
  for (const rule of retiredRules) {
    if (rule.id) retiredByKey.set(`${rule.collection}:${rule.language}:${rule.id}`, rule);
    retiredByFile.set(rule.file, rule);
  }

  const { perFile, renames } = historicalFieldValues();

  const redirects = new Map(); // from -> to
  const orphaned = []; // historical files with no current route

  for (const [historicalFile, fields] of perFile) {
    const collection = collectionFromPath(historicalFile);
    // Collections with no page route (bikes, testimonials, navigation) never
    // produced a URL, so there is nothing to redirect.
    if (!collection) continue;

    const language = languageFromPath(historicalFile);

    // Prefer matching on `id`, which survives renames; fall back to git's own
    // rename detection, then to the path being unchanged.
    let route = null;
    for (const id of fields.get('id') ?? []) {
      route = routes.get(`${collection}:${language}:${id}`);
      if (route) break;
    }
    const currentFile = route?.file ?? resolveRenames(historicalFile, renames);
    route ??= byFile.get(currentFile);

    // Substitute each historical value into the highest-precedence slug slot,
    // so a value that used to live in `title` still yields the URL it produced
    // back when the entry had no `path`.
    const config = COLLECTIONS[route?.collection ?? collection];
    const [primary] = config.slugFrom;
    const candidates = new Set();
    for (const [field, values] of fields) {
      if (!SLUG_FIELDS.has(field)) continue; // `id` is identity, not a slug
      for (const value of values) {
        if (!value) continue;
        candidates.add(
          config.url(
            { [primary]: value },
            route?.language ?? language,
            currentFile
          )
        );
      }
    }

    if (!route) {
      let retiredRule = null;
      for (const id of fields.get('id') ?? []) {
        retiredRule = retiredByKey.get(`${collection}:${language}:${id}`);
        if (retiredRule) break;
      }
      retiredRule ??= retiredByFile.get(currentFile);
      if (retiredRule) {
        for (const from of candidates) {
          if (from === retiredRule.from) continue; // its own rule covers it
          if (live.has(from) || manual.sources.has(from)) continue;
          if (redirects.has(from) && redirects.get(from) !== retiredRule.destination) {
            redirects.delete(from);
            continue;
          }
          redirects.set(from, retiredRule.destination);
        }
        continue;
      }
      // This entry has no current page. That only costs a URL if none of the
      // URLs it produced is served by something else today — CloudCannon
      // routinely replaces a file with a fresh id while keeping the same
      // `path`, which reads as a deletion here but changes nothing publicly.
      const lost = [...candidates].filter(
        (url) => !live.has(url) && !retired.has(url)
      );
      if (lost.length) orphaned.push({ file: historicalFile, urls: lost });
      continue;
    }

    for (const from of candidates) {
      if (from === route.url) continue; // still the live URL
      if (live.has(from)) continue; // another page owns this URL today
      if (manual.sources.has(from)) continue; // data/routing.json already covers it
      if (retired.has(from)) continue; // a retired entry's own redirect wins
      // Emitting this would send traffic to a URL that data/routing.json then
      // redirects again — or, if the two disagree, straight into a loop.
      if (manual.destinations.has(from)) continue;
      if (redirects.has(from) && redirects.get(from) !== route.url) {
        // Two entries claim the same historical URL. Leave it to a human.
        redirects.delete(from);
        continue;
      }
      redirects.set(from, route.url);
    }
  }

  const routes301 = [...redirects.entries()]
    .map(([from, destination]) => ({ from, destination, status: 301 }))
    .sort((a, b) => a.from.localeCompare(b.from));

  return { routes: routes301, orphaned, problems, routeCount: routes.size };
}

// --- run ---------------------------------------------------------------

if (!hasFullHistory()) {
  const message =
    'git history is shallow — cannot derive historical URLs. ' +
    'Fetch full history (git fetch --unshallow) before regenerating.';
  if (check && existsSync(OUTPUT)) {
    console.warn(`⚠ url-history: ${message} Using the committed file as-is.`);
    process.exit(0);
  }
  console.error(`✗ url-history: ${message}`);
  process.exit(1);
}

const { routes, orphaned, problems, routeCount } = build();
const payload = {
  $comment:
    'Generated by tools/seo/url-history.mjs — do not edit. Hand-written ' +
    'redirects belong in data/routing.json, which takes precedence.',
  generatedFrom: `${routeCount} routable content entries`,
  routes
};
const serialised = `${JSON.stringify(payload, null, 2)}\n`;

for (const problem of problems) {
  console.warn(`⚠ ${problem.file}: ${problem.reason}`);
}
if (orphaned.length) {
  const lostUrls = orphaned.flatMap((entry) => entry.urls);
  console.warn(
    `⚠ ${lostUrls.length} URL(s) from ${orphaned.length} deleted entr(ies) are ` +
      'no longer served and have no automatic destination.\n' +
      '  Add a redirect in data/routing.json if any of them ever ranked:'
  );
  for (const url of lostUrls.slice(0, 12)) console.warn(`    ${url}`);
  if (lostUrls.length > 12)
    console.warn(`    …and ${lostUrls.length - 12} more`);
}

if (check) {
  const existing = existsSync(OUTPUT) ? readFileSync(OUTPUT, 'utf8') : '';
  if (existing !== serialised) {
    console.error(
      '✗ data/url-history.json is out of date — a content slug changed ' +
        'without its redirect being generated.\n' +
        '  Run: pnpm seo:urls'
    );
    process.exit(1);
  }
  console.log(
    `✓ url-history is current (${routes.length} historical URLs covered)`
  );
  process.exit(0);
}

writeFileSync(OUTPUT, serialised, 'utf8');
console.log(
  `✓ data/url-history.json written — ${routes.length} historical URLs ` +
    `redirect to ${routeCount} live pages`
);
