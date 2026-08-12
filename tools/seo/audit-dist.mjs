#!/usr/bin/env node
/**
 * Post-build audit of the emitted HTML.
 *
 * Guards the indexability signals that regressed silently on this site:
 *   - structured data that parses, with a valid rating scale
 *   - review and price markup only on the page whose subject it is, never on
 *     a listing page (that is what let the tag and region pages outrank the
 *     tours they link to)
 *   - every image URL in structured data actually resolving in dist
 *   - one self-referencing canonical per page
 *   - every sitemap URL present in dist, and carrying a lastmod
 *
 *   node tools/seo/audit-dist.mjs
 */

import { readFileSync, existsSync, globSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/routes.mjs';

const DIST = join(REPO_ROOT, 'dist');
const SITE = 'https://topbiketoursportugal.com';

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run a build first.');
  process.exit(1);
}

const failures = [];
const warnings = [];
const fail = (rule, page, message) => failures.push({ rule, page, message });
const warn = (rule, page, message) => warnings.push({ rule, page, message });

/** A page whose subject is one tour: /tours/<slug>/ but not a taxonomy folder. */
const TAXONOMY = /^\/(pt\/)?tours\/(tags|regions|rider-levels|bike-types)\//;
const isTourDetail = (url) =>
  /^\/(pt\/)?tours\/[^/]+\/$/.test(url) && !TAXONOMY.test(url);

const htmlFiles = globSync('**/*.html', { cwd: DIST });
const distPaths = new Set(htmlFiles.map((f) => f.split(/[\\/]/).join('/')));

/** Does an absolute or root-relative asset URL resolve to a file in dist? */
function assetExists(value) {
  if (typeof value !== 'string') return false;
  let path = value;
  if (path.startsWith(SITE)) path = path.slice(SITE.length);
  else if (path.startsWith('http')) return true; // off-site, not ours to check
  path = decodeURIComponent(path.split('?')[0]).replace(/^\//, '');
  return existsSync(join(DIST, path));
}

/** Walk every node of a JSON-LD document. */
function* nodes(value) {
  if (Array.isArray(value)) {
    for (const item of value) yield* nodes(item);
  } else if (value && typeof value === 'object') {
    yield value;
    for (const child of Object.values(value)) yield* nodes(child);
  }
}

const LD_BLOCK =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
const CANONICAL = /<link[^>]+rel=["']canonical["'][^>]*>/g;
const HREF = /href=["']([^"']+)["']/;

for (const file of htmlFiles) {
  const relative = file.split(/[\\/]/).join('/');
  const url = `/${relative.replace(/index\.html$/, '')}`;
  const html = readFileSync(join(DIST, file), 'utf8');

  // --- canonicals ------------------------------------------------------
  // Only rendered routes. Files copied straight from public/ (search-engine
  // verification stubs) are not pages and have no canonical to check.
  const isRenderedPage = relative.endsWith('index.html');
  const canonicals = html.match(CANONICAL) ?? [];
  if (!isRenderedPage) {
    // fall through to the structured-data checks below
  } else if (canonicals.length === 0) {
    warn('canonical-missing', url, 'no canonical link');
  } else if (canonicals.length > 1) {
    fail('canonical-duplicate', url, `${canonicals.length} canonical links`);
  } else {
    const href = HREF.exec(canonicals[0])?.[1];
    const expected = `${SITE}${url}`;
    if (
      href &&
      href !== expected &&
      !html.includes('name="robots" content="noindex')
    ) {
      // A canonical that points somewhere else hands that page's indexing to
      // another URL. That is occasionally deliberate, so it is a warning —
      // unless the target does not exist, which is never intentional and
      // silently deindexes the page.
      const target = href.startsWith(SITE) ? href.slice(SITE.length) : null;
      const targetPage = target
        ? `${target.replace(/^\//, '')}${target.endsWith('/') ? 'index.html' : '/index.html'}`
        : null;
      if (targetPage && !distPaths.has(targetPage)) {
        fail(
          'canonical-dead-target',
          url,
          `canonical points at ${href}, which is not a built page`
        );
      } else {
        warn(
          'canonical-mismatch',
          url,
          `points at ${href}, expected ${expected}`
        );
      }
    }
  }

  // --- structured data -------------------------------------------------
  LD_BLOCK.lastIndex = 0;
  let match;
  while ((match = LD_BLOCK.exec(html))) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (error) {
      fail('ld-invalid-json', url, `JSON-LD does not parse: ${error.message}`);
      continue;
    }

    for (const node of nodes(parsed)) {
      const type = node['@type'];

      // Rating scale must have range, and the value must sit inside it.
      const rating =
        node.aggregateRating ?? (type === 'AggregateRating' ? node : null);
      if (rating && typeof rating === 'object') {
        const best = Number(rating.bestRating ?? 5);
        const worst = Number(rating.worstRating ?? 1);
        const value = Number(rating.ratingValue);
        if (!(worst < best)) {
          fail(
            'rating-scale',
            url,
            `worstRating (${rating.worstRating}) must be below bestRating (${rating.bestRating})`
          );
        } else if (Number.isFinite(value) && (value < worst || value > best)) {
          fail(
            'rating-range',
            url,
            `ratingValue ${value} is outside ${worst}–${best}`
          );
        }
      }

      // Reviews and prices belong to the page's own subject.
      if (type === 'Product' && !isTourDetail(url)) {
        const carries = ['review', 'aggregateRating', 'offers'].filter(
          (key) => node[key]
        );
        if (carries.length) {
          fail(
            'listing-product-markup',
            url,
            `Product carries ${carries.join(', ')} on a page that is not that product`
          );
        }
      }

      // Images Google cannot fetch make the rich result ineligible.
      for (const key of ['image', 'logo']) {
        const value = node[key];
        const candidates = Array.isArray(value) ? value : [value];
        for (const candidate of candidates) {
          const src =
            typeof candidate === 'object' ? candidate?.url : candidate;
          if (typeof src !== 'string') continue;
          if (!assetExists(src)) {
            fail(
              'ld-broken-image',
              url,
              `${type ?? 'node'}.${key} does not resolve: ${src}`
            );
          }
        }
      }
    }
  }
}

// --- sitemap -----------------------------------------------------------

const sitemaps = globSync('sitemap-*.xml', { cwd: DIST }).filter(
  (f) => !f.includes('index')
);
let sitemapUrls = 0;
let missingLastmod = 0;
let missingAlternates = 0;
/** sitemap URL -> its hreflang alternates, for the reciprocity check below. */
const alternates = new Map();

for (const file of sitemaps) {
  const xml = readFileSync(join(DIST, file), 'utf8');
  for (const entry of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    sitemapUrls++;
    const loc = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1];
    if (!loc) continue;
    const path = new URL(loc).pathname;
    const candidate = `${path.replace(/^\//, '')}${path.endsWith('/') ? 'index.html' : '/index.html'}`;
    if (!distPaths.has(candidate.replace(/^\//, ''))) {
      fail('sitemap-404', path, 'listed in the sitemap but not built');
    }
    if (!entry.includes('<lastmod>')) missingLastmod++;

    const links = [
      ...entry.matchAll(
        /<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g
      )
    ].map(([, lang, href]) => ({ lang, href }));
    alternates.set(loc, links);
    if (!links.length) missingAlternates++;
  }
}

// Google discards a translation set that is not fully connected: every URL in
// it must list every other one, and list itself. A one-way annotation is not a
// harmless extra — it is the whole set going unused.
for (const [loc, links] of alternates) {
  if (!links.length) continue;

  const translations = links.filter((link) => link.lang !== 'x-default');
  if (!translations.some((link) => link.href === loc)) {
    fail('hreflang-no-self', loc, 'its alternates do not include itself');
  }

  for (const { lang, href } of links) {
    if (!assetExists(href)) {
      fail('hreflang-404', loc, `${lang} alternate does not resolve: ${href}`);
      continue;
    }
    if (lang === 'x-default') continue;
    const back = alternates.get(href);
    if (!back) {
      fail('hreflang-unlisted', loc, `${lang} alternate is not in the sitemap`);
    } else if (!back.some((link) => link.href === loc)) {
      fail('hreflang-no-return', loc, `${href} does not link back`);
    }
  }
}

if (missingAlternates > 0) {
  warn(
    'hreflang-missing',
    'sitemap',
    `${missingAlternates} of ${sitemapUrls} URLs have no hreflang alternates — expected only for untranslated pages`
  );
}

if (missingLastmod > 0) {
  const rule = missingLastmod === sitemapUrls ? fail : warn;
  rule(
    'sitemap-lastmod',
    'sitemap',
    `${missingLastmod} of ${sitemapUrls} URLs have no lastmod — Google has no recrawl signal for them`
  );
}

// --- report ------------------------------------------------------------

console.log(
  `seo:audit-dist — ${htmlFiles.length} pages, ${sitemapUrls} sitemap URLs\n`
);

const summarise = (items, symbol, stream) => {
  const byRule = new Map();
  for (const item of items) {
    if (!byRule.has(item.rule)) byRule.set(item.rule, []);
    byRule.get(item.rule).push(item);
  }
  for (const [rule, entries] of byRule) {
    const pages = new Set(entries.map((entry) => entry.page));
    const scale =
      entries.length === pages.size
        ? `${pages.size} page(s)`
        : `${entries.length} occurrence(s) across ${pages.size} page(s)`;
    stream(`${symbol} [${rule}] ${scale}`);
    for (const entry of entries.slice(0, 5)) {
      stream(`    ${entry.page} — ${entry.message}`);
    }
    if (entries.length > 5) stream(`    …and ${entries.length - 5} more`);
  }
};

summarise(warnings, '⚠', (line) => console.warn(line));
if (warnings.length) console.warn('');
summarise(failures, '✗', (line) => console.error(line));

if (failures.length) {
  console.error(
    `\n${failures.length} problem(s) must be fixed before deploying.`
  );
  process.exit(1);
}
console.log(
  `✓ structured data, canonicals and sitemap are clean${
    warnings.length ? ` (${warnings.length} warning(s))` : ''
  }`
);
