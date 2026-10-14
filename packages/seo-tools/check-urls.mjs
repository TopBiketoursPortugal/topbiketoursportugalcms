#!/usr/bin/env node
/**
 * Guard against the URL mistakes that cost this site its tour rankings.
 *
 * Fails the build when:
 *   - two content entries resolve to the same public URL
 *   - a slug changed without data/url-history.json being regenerated
 *   - a redirect points somewhere that does not exist
 *   - a redirect points at another redirect (chains lose signal at each hop)
 *   - a redirect's source is a live page, so the rule can never fire
 *
 * Run after a build to validate against dist/ (authoritative — it knows about
 * paginated and index routes that no content entry produces). Run without a
 * build for a fast pre-commit check against the content tree.
 *
 *   node tools/seo/check-urls.mjs
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, globSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REPO_ROOT,
  LANGUAGES,
  collectRoutes,
  liveUrlSet,
  normalisePath
} from './lib/routes.mjs';
import { isUnnamed } from './lib/alternates.mjs';

const DIST = join(REPO_ROOT, 'dist');
const failures = [];
const warnings = [];

const fail = (rule, message, detail) =>
  failures.push({ rule, message, detail });
const warn = (rule, message, detail) =>
  warnings.push({ rule, message, detail });

// --- what URLs exist ---------------------------------------------------

const { routes, problems } = collectRoutes();
for (const problem of problems) {
  fail('content', `${problem.file}: ${problem.reason}`);
}

// A file still carrying CloudCannon's `new-<collection>-<n>` name cannot be
// matched to its translation — the numbering runs per language folder, so the
// English and Portuguese file with the same number are unrelated entries. Such
// a page ships without hreflang, so it competes with its own translation.
const unnamed = [...routes.values()].filter((route) => isUnnamed(route.file));
if (unnamed.length) {
  warn(
    'unnamed-content',
    `${unnamed.length} file(s) still have CloudCannon's default name, so their translations cannot be paired for hreflang`,
    unnamed.slice(0, 5).map((route) => `${route.file} — ${route.url}`)
  );
}

// `path` is the URL; `title` is a display name that marketing changes freely.
// Every routable collection but `team` prefers `path` and falls back to the
// title, so an entry with a missing or blank `path` has its URL wired to its
// heading — rename the tour in CloudCannon and the URL moves with it. Worse,
// a blank (rather than absent) `path` still satisfies the `??` in the template
// and slugifies to nothing, collapsing the route onto the collection index.
// Fail here so neither can reach a build.
// A language root (`/`, `/pt/`) is not slugged from anything — pages/index.mdx
// is special-cased by the route table — so it is exempt.
const isLanguageRoot = (url) => /^\/([a-z]{2}\/)?$/.test(url);
const titleDerived = [...routes.values()].filter(
  (route) =>
    route.slugPreferred === 'path' &&
    route.slugField !== 'path' &&
    !isLanguageRoot(route.url)
);
if (titleDerived.length) {
  fail(
    'url-from-title',
    `${titleDerived.length} entr(ies) have no usable \`path\`, so their URL is derived from a field that is safe to rename`,
    titleDerived.map(
      (route) =>
        `${route.file} — ${route.url} (from \`${route.slugField ?? 'nothing'}\`)`
    )
  );
}

// Translation stubs waiting on a translator. These publish nothing, so they
// are not a problem to fix — but left unreported they are invisible, and the
// point of creating them automatically is that the backlog stays visible.
const pending = globSync(
  `src/content/**/{${LANGUAGES.filter((l) => l !== 'en').join(',')}}/**/*.{md,mdx}`,
  {
    cwd: REPO_ROOT
  }
).filter((file) =>
  /^draft:\s*true\s*$/m.test(
    readFileSync(join(REPO_ROOT, file), 'utf8').split(/^---$/m)[1] ?? ''
  )
);
if (pending.length) {
  warn(
    'pending-translation',
    `${pending.length} translation stub(s) awaiting translation — unpublished until their \`draft\` line is removed`,
    pending.slice(0, 5).map((file) => file.split(/[\\/]/).join('/'))
  );
}

const usingDist = existsSync(DIST) && statSync(DIST).isDirectory();

/** URLs served by the built site, from the emitted index.html files. */
function urlsFromDist() {
  const urls = new Set();
  for (const match of globSync('**/index.html', { cwd: DIST })) {
    const path = match.split(/[\\/]/).slice(0, -1).join('/');
    urls.add(path ? `/${path}/` : '/');
  }
  return urls;
}

const live = usingDist ? urlsFromDist() : liveUrlSet(routes);

// Routes that exist but are produced by page components rather than content
// entries. Only needed for the pre-build fallback; dist/ knows them already.
// The numeric segment is required on the paginated patterns: /blog/ and
// /blog/tags/<slug>/ are real content entries, and matching them here would
// make every tag URL look like it exists.
const NON_CONTENT_ROUTES = [
  /^\/([a-z]{2}\/)?$/,
  /^\/404\/$/,
  /^\/([a-z]{2}\/)?tours\/(tags|rider-levels|bike-types)\/$/,
  /^\/([a-z]{2}\/)?blog\/\d+\/$/,
  /^\/([a-z]{2}\/)?blog\/tags\/[^/]+\/\d+\/$/
];

const exists = (url) =>
  live.has(url) ||
  (!usingDist && NON_CONTENT_ROUTES.some((pattern) => pattern.test(url)));

// Netlify resolves paths case-insensitively, so a destination that differs
// only in casing still works — but it is a latent trap on any other host, and
// it makes the redirect map harder to reason about.
const liveLowercase = new Set([...live].map((url) => url.toLowerCase()));
const existsIgnoringCase = (url) =>
  liveLowercase.has(url.toLowerCase()) ||
  (!usingDist &&
    NON_CONTENT_ROUTES.some((pattern) => pattern.test(url.toLowerCase())));

// --- 1. no two entries may claim the same URL --------------------------

const byUrl = new Map();
for (const route of routes.values()) {
  if (!byUrl.has(route.url)) byUrl.set(route.url, []);
  byUrl.get(route.url).push(route.file);
}
for (const [url, files] of byUrl) {
  if (files.length > 1) {
    fail('duplicate-url', `${files.length} entries resolve to ${url}`, files);
  }
}

// --- 2. url-history.json must be current -------------------------------

try {
  execFileSync(
    'node',
    [fileURLToPath(new URL('./url-history.mjs', import.meta.url)), '--check'],
    {
      cwd: REPO_ROOT,
      stdio: 'pipe',
      encoding: 'utf8'
    }
  );
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  fail(
    'stale-url-history',
    'a content slug changed without its redirect being generated',
    output.split('\n')
  );
}

// --- 3. redirect health ------------------------------------------------

const readRoutes = (file) => {
  const path = join(REPO_ROOT, file);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8')).routes ?? [];
};

const manual = readRoutes('data/routing.json');
const generated = readRoutes('data/url-history.json');

const sources = new Map(); // from -> destination (manual wins, as in the build)
for (const rule of [...generated, ...manual]) {
  sources.set(normalisePath(rule.from), normalisePath(rule.destination));
}

const seen = new Set();
for (const rule of manual) {
  const from = normalisePath(rule.from);
  if (seen.has(from)) {
    warn(
      'duplicate-rule',
      `data/routing.json redirects ${from} more than once`
    );
  }
  seen.add(from);
}

for (const [from, destination] of sources) {
  if (exists(from)) {
    warn('inert-rule', `${from} is a live page, so its redirect never fires`, [
      `declared destination: ${destination}`
    ]);
    continue;
  }
  if (destination.startsWith('http')) continue;

  if (sources.has(destination)) {
    fail(
      'redirect-chain',
      `${from} redirects to ${destination}, which redirects again`,
      [`collapse it to: ${from} -> ${sources.get(destination)}`]
    );
    continue;
  }
  if (!exists(destination)) {
    if (existsIgnoringCase(destination)) {
      warn(
        'redirect-casing',
        `${from} redirects to ${destination}, which only resolves because the ` +
          'host is case-insensitive',
        [`use the exact path: ${destination.toLowerCase()}`]
      );
      continue;
    }
    fail(
      'dead-redirect',
      `${from} redirects to ${destination}, which does not exist`
    );
  }
}

// --- report ------------------------------------------------------------

const label = usingDist ? 'dist/' : 'content tree (dist/ not built)';
console.log(
  `seo:check-urls — ${routes.size} content routes, ${live.size} URLs in ${label}, ` +
    `${sources.size} redirect rules\n`
);

for (const { rule, message, detail } of warnings) {
  console.warn(`⚠ [${rule}] ${message}`);
  for (const line of detail ?? []) console.warn(`    ${line}`);
}
if (warnings.length) console.warn('');

for (const { rule, message, detail } of failures) {
  console.error(`✗ [${rule}] ${message}`);
  for (const line of detail ?? []) console.error(`    ${line}`);
}

if (failures.length) {
  console.error(
    `\n${failures.length} problem(s) must be fixed before deploying.`
  );
  process.exit(1);
}
console.log(
  `✓ no URL or redirect problems${warnings.length ? ` (${warnings.length} warning(s))` : ''}`
);
