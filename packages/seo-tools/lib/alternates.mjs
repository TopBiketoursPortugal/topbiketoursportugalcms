/**
 * hreflang alternates for the sitemap.
 *
 * @astrojs/sitemap's `i18n` option pairs translations by URL shape alone: it
 * strips the locale prefix and links pages whose remaining path is identical.
 * Every slug on this site is translated (`/about-us-biking-travel/` ↔
 * `/pt/sobre-nos/`), so that rule paired only the handful of entries whose
 * Portuguese slug happens to match the English one — 48 of the 400 translated
 * URLs — and left the rest with no alternates at all. To Google those are two
 * unrelated pages competing with each other, not one page in two languages.
 *
 * Translations are paired here exactly the way the pages themselves pair them
 * in utils/permalinks.ts (`getTourLanguagesAlternates` and friends): same
 * collection, same source filename, different language folder. Building the
 * URLs from routes.mjs keeps the sitemap on the same slug rules as the rest of
 * the SEO tooling, so a drift shows up in tools/seo/check-urls.mjs.
 */

import { collectRoutes, LANGUAGES_DATA, PAGINATED } from './routes.mjs';

/** Locale code -> hreflang value. Mirrors the sitemap `i18n.locales` map. */
export const LOCALES = Object.fromEntries(
  Object.values(LANGUAGES_DATA).map((l) => [l.code, l.locale])
);

export const DEFAULT_LOCALE = 'en';

/**
 * CloudCannon's default name for a new entry, `new-<collection>-<n>`.
 *
 * It numbers each language folder independently, so the numbers line up by
 * accident and nothing else: src/content/blog/new-blog-13.mdx is "Biking from
 * Porto to Santiago" while blog/pt/new-blog-13.mdx is "As E-Bikes São Batota?"
 * — different articles. A default name carries no identity, so these entries
 * are left unpaired rather than told to Google as translations of each other.
 * Renaming a pair to a shared descriptive name is what opts it back in.
 */
const UNNAMED = /^new-[a-z]+(-\d+)?$/;

export const isUnnamed = (filePath) =>
  UNNAMED.test(
    filePath
      .split('/')
      .at(-1)
      .replace(/\.mdx?$/, '')
  );

let cache = null;

/**
 * Two lookups over the content tree, built in one pass:
 *
 *   `byUrl`   url -> [{ path, lang }], the whole translation set for that URL
 *             (including the URL itself — hreflang must be self-referencing)
 *             plus an `x-default` pointing at the English page.
 *   `unnamed` URLs whose entry still has CloudCannon's default filename.
 */
function index() {
  if (cache) return cache;

  cache = { byUrl: new Map(), unnamed: new Set() };

  try {
    const { routes } = collectRoutes();

    // An entry and its translation share a filename, one per language folder.
    const groups = new Map();
    for (const route of routes.values()) {
      if (!LOCALES[route.language]) continue;
      if (isUnnamed(route.file)) {
        cache.unnamed.add(route.url);
        continue;
      }
      const key = `${route.collection}:${route.file.split('/').at(-1)}`;
      const group = groups.get(key);
      if (group) group.push(route);
      else groups.set(key, [route]);
    }

    for (const group of groups.values()) {
      // A single-language group has nothing to point at; a lone hreflang is
      // not a translation set, so leave those URLs unannotated.
      if (group.length < 2) continue;

      const links = group.map((route) => ({
        path: route.url,
        lang: LOCALES[route.language]
      }));

      const fallback = group.find((route) => route.language === DEFAULT_LOCALE);
      if (fallback) links.push({ path: fallback.url, lang: 'x-default' });

      for (const route of group) cache.byUrl.set(route.url, links);
    }
  } catch (error) {
    // Alternates are an enhancement — never fail a build over them.
    console.warn(
      `⚠ sitemap hreflang alternates unavailable (${error.message})`
    );
  }

  return cache;
}

/**
 * The hreflang alternates a sitemap URL should carry, in the `{ url, lang }`
 * shape @astrojs/sitemap expects, or undefined when it should carry none.
 *
 * `pathPaired` is whatever the sitemap's own `i18n` option matched by path. It
 * is kept for the routes no content entry produces (the `/tours/tags/`-style
 * index pages), with `x-default` added so every annotated URL carries the same
 * shape — but discarded for an unnamed entry, where a matching path is a slug
 * that was pasted between languages rather than evidence of a translation.
 *
 * Page 2+ of a listing gets nothing on purpose: the translations run to
 * different numbers of pages (English cycling-tips has five, Portuguese has
 * two), so there is no equivalent page to point at. Pointing page 5 at the
 * translation's page 1 would not be reciprocated from that page, and hreflang
 * without a return link is discarded. `[...page].astro` applies the same rule
 * to the markup it emits (`pageNumber === 1 ? hrefsWithSelf : []`), and the two
 * have to agree or tools/seo/audit-dist.mjs reports the pair as a mismatch.
 */
export function alternatesFor(absoluteUrl, pathPaired) {
  const { origin, pathname } = new URL(absoluteUrl);
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const { byUrl, unnamed } = index();

  const links = byUrl.get(path);
  if (links) {
    return links.map(({ path: href, lang }) => ({
      url: `${origin}${href}`,
      lang
    }));
  }

  if (unnamed.has(path) || PAGINATED.test(path)) return undefined;
  if (!pathPaired?.length) return undefined;
  if (pathPaired.some((link) => link.lang === 'x-default')) return pathPaired;

  const fallback = pathPaired.find(
    (link) => link.lang === LOCALES[DEFAULT_LOCALE]
  );
  return fallback
    ? [...pathPaired, { url: fallback.url, lang: 'x-default' }]
    : pathPaired;
}
