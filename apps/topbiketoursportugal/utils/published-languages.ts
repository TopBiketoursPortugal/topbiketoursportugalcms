import { getCollection } from 'astro:content';
import { languageCodes, type LanguageCodes } from 'src/schemas/language';

/**
 * The locales the site actually serves: those whose home page is published.
 *
 * `languageCodes` lists every locale the site is *configured* for. A locale
 * added before its content is translated only has draft stubs (see the
 * mdx-clone tool), which the collections exclude — so it has no pages, and
 * anything that fans out over `languageCodes` (locale index routes, the
 * language switcher, hreflang alternates) would point at 404s. Fan out over
 * this instead.
 */
export async function getPublishedLanguages(): Promise<LanguageCodes[]> {
  const pages = await getCollection('pages');
  const homes = new Set(
    pages
      .filter((p) => /(^|\/)index\.mdx$/.test(p.filePath ?? ''))
      .map((p) => p.data.language ?? 'en')
  );
  return languageCodes.filter((code) => homes.has(code));
}
