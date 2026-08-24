import {
  getCollection,
  type CollectionEntry,
  type CollectionKey
} from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';
import type { HrefLang } from 'src/types/hreflang';
import PermalinkData from 'src/../data/permalinks.json';

const doublSlashRegex = /([^:])\/{2,}/g;

export const trailingSlash = '/';

export function sanitizeUrl(url: string) {
  if (url?.length === 0) {
    return '/404/';
  }
  return url.replace(doublSlashRegex, '$1/');
}

export function getBasePath(language: LanguageCodes = 'en'): string {
  return sanitizeUrl(language === 'en' ? '/' : `/${language}/`);
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return sanitizeUrl(
    `${getBasePath(language)}team/${slugify(memberName, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

export function getTourPath(
  { path, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  return sanitizeUrl(
    `${getBasePath(language)}${tourPermalink}/${slugify(path ?? title, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

export function getTourRegionsPath(
  region: CollectionEntry<'tourRegions'>,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  return sanitizeUrl(
    `${getBasePath(language)}${tourPermalink}/regions/${slugify(region.data.path ?? region.data.name ?? region.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

export function getTourTagPath(
  tag: CollectionEntry<'tourTags'>,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];

  const path = `${getBasePath(language)}${tourPermalink}/tags/${slugify(tag.data.path ?? tag.data.name ?? tag.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

export function getTourTagsListingPath(language: LanguageCodes = 'en'): string {
  const tourPermalink = PermalinkData.tours[language];
  return sanitizeUrl(
    `${getBasePath(language)}${tourPermalink}/tags${trailingSlash}`
  );
}

export function getRiderLevelPath(
  level: CollectionEntry<'tourRiderLevels'>,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  const path = `${getBasePath(language)}${tourPermalink}/rider-levels/${slugify(level.data.path ?? level.data.name ?? level.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

export function getRiderLevelsListingPath(
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  return sanitizeUrl(
    `${getBasePath(language)}${tourPermalink}/rider-levels${trailingSlash}`
  );
}

export async function getRiderLevelLanguagesAlternates(
  riderLevel: CollectionEntry<'tourRiderLevels'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternateRiderLevels = await languageAlternates(
    'tourRiderLevels',
    riderLevel.filePath
  );

  return alternateRiderLevels.map(({ data: alternate }) => ({
    href: sanitizeUrl(
      `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}${PermalinkData.tours[alternate.language ?? 'en']}/rider-levels/${slugify(alternate.path ?? alternate.name ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternate.language
  }));
}

export function getBikeCategoryPath(
  category: CollectionEntry<'bikeCategories'>,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  const path = `${getBasePath(language)}${tourPermalink}/bike-types/${slugify(category.data.path ?? category.data.name ?? category.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

export function getBikeCategoriesListingPath(
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];
  return sanitizeUrl(
    `${getBasePath(language)}${tourPermalink}/bike-types${trailingSlash}`
  );
}

export async function getBikeCategoryLanguagesAlternates(
  bikeCategory: CollectionEntry<'bikeCategories'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternateCategories = await languageAlternates(
    'bikeCategories',
    bikeCategory.filePath
  );

  return alternateCategories.map(({ data: alternate }) => ({
    href: sanitizeUrl(
      `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}${PermalinkData.tours[alternate.language ?? 'en']}/bike-types/${slugify(alternate.path ?? alternate.name ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternate.language
  }));
}

export function getBlogTagPath(
  tag: CollectionEntry<'postTags'>,
  language: LanguageCodes = 'en'
): string {
  const path = `${getBasePath(language)}blog/tags/${slugify(tag.data.path ?? tag.data.name ?? tag.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

/**
 * Basename of a collection entry's source file, used to match the same
 * logical entry across per-language content folders when building hreflang
 * alternates. Every entry these collections load carries a `filePath`; one
 * missing it is a content bug — fail loudly rather than silently produce
 * wrong (or missing) alternates for it.
 */
function entryFileKey(filePath: string | undefined): string {
  const key = filePath?.split('/').at(-1);
  if (!key) {
    throw new Error(
      `Collection entry is missing a filePath — cannot resolve its language alternates`
    );
  }
  return key;
}

/**
 * CloudCannon's default name for a new entry, `new-<collection>-<n>`. It
 * numbers each language folder independently, so two files sharing one of
 * these names are different items rather than a translation pair — pairing on
 * it would tell Google that unrelated posts are translations of each other.
 *
 * Mirrors tools/seo/lib/alternates.mjs, which applies the same rule to the
 * sitemap; tools/seo/audit-dist.mjs fails the build if the two disagree.
 */
const UNNAMED_ENTRY = /^new-[a-z]+(-\d+)?$/;

function isUnnamedEntry(fileKey: string): boolean {
  return UNNAMED_ENTRY.test(fileKey.replace(/\.mdx?$/, ''));
}

/**
 * Every entry that is the same logical item as `filePath` in some language,
 * including that entry itself — hreflang annotations must be self-referencing.
 *
 * Returns nothing unless at least two languages are present. A page that
 * points only at itself is not a translation set: Google ignores it, and
 * emitting one would put the page's markup at odds with the sitemap, which
 * leaves those URLs unannotated.
 */
async function languageAlternates<C extends CollectionKey>(
  collection: C,
  filePath: string | undefined
): Promise<CollectionEntry<C>[]> {
  const fileKey = entryFileKey(filePath);
  if (isUnnamedEntry(fileKey)) return [];

  const entries = await getCollection(
    collection,
    (entry: CollectionEntry<C>) => entry.filePath?.split('/').at(-1) === fileKey
  );
  return (entries ?? []).length > 1 ? entries : [];
}

function trim(str = '', ch?: string): string {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
}

export function trimSlash(s: string): string {
  return trim(trim(s, '/'));
}

export function getHomePermalink(language: LanguageCodes = 'en'): string {
  return sanitizeUrl(language === 'en' ? '/' : `/${language}${trailingSlash}`);
}

export function getPagePath(page: CollectionEntry<'pages'>) {
  const language = page.data.language ?? 'en';

  if (
    // page.data.path === '' ||
    page.data.path === 'index' ||
    page.data.path === 'home' ||
    page.filePath?.endsWith('index.md') ||
    page.filePath?.endsWith('index.mdx')
  ) {
    return getHomePermalink(language);
  }
  const pagePath =
    `${getBasePath(language)}${slugify(page.data.path ?? page.data.title, { lower: true, strict: true, trim: true }).replace(/index$/, '')}${trailingSlash}`.toLocaleLowerCase();
  return sanitizeUrl(pagePath);
}

export function getBlogPagePath(
  pageNum: number,
  language: LanguageCodes = 'en',
  site: URL = new URL('https://topwalkingtoursportual.com')
): string {
  const pagePath = pageNum === 1 ? '' : `/${pageNum}`;
  return sanitizeUrl(
    `${site}${getBasePath(language)}blog${pagePath}${trailingSlash}`
  );
}

export function getBlogPermalink({ data }: CollectionEntry<'blog'>): string {
  const language = data.language ?? 'en';
  return sanitizeUrl(
    `${getBasePath(language)}blog/${slugify(data.path ?? data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

/** `/guides/` listing for a language. */
export function getGuidesIndexPath(language: LanguageCodes = 'en'): string {
  return sanitizeUrl(`${getBasePath(language)}guides${trailingSlash}`);
}

/**
 * `/guides/<slug>/` (en) or `/<lang>/guides/<slug>/`. Slug from `path`, else
 * `title` — the same rule as blog posts, mirrored in
 * tools/seo/lib/routes.mjs `COLLECTIONS.guides`.
 *
 * Accepts either a full entry or `{ data }` so layouts that only hold the
 * frontmatter can call it too. `language` overrides the entry's own — useful
 * when an English listing links to a translation.
 */
export function getGuidePath(
  entry: Pick<CollectionEntry<'guides'>, 'data'>,
  language?: LanguageCodes
): string {
  const { data } = entry;
  const lang = language ?? data.language ?? 'en';
  return sanitizeUrl(
    `${getBasePath(lang)}guides/${slugify(data.path ?? data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

export async function getGuideLanguagesAlternates(
  guide: CollectionEntry<'guides'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
): Promise<ReadonlyArray<HrefLang>> {
  const alternateGuides = await languageAlternates('guides', guide.filePath);

  return alternateGuides.map((alternateGuide) => {
    const { data: alternate } = alternateGuide;
    return {
      href: sanitizeUrl(
        `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}guides/${slugify(alternate.path ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
      ),
      hreflang: alternate.language
    };
  });
}

export async function getTeamLanguagesAlternates(
  pageEntry: CollectionEntry<'team'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternatePages = await languageAlternates('team', pageEntry.filePath);

  return alternatePages.map((page) => {
    const { data: alternate } = page;
    return {
      href: sanitizeUrl(
        `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}team/${slugify(alternate.path ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
      ),
      hreflang: alternate.language
    };
  });
}

export async function getPageLanguagesAlternates(
  pageEntry: CollectionEntry<'pages'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
): Promise<ReadonlyArray<HrefLang>> {
  const alternatePages = await languageAlternates('pages', pageEntry.filePath);

  return alternatePages.map((page) => {
    const { data: alternate } = page;
    if (
      page.data.path === 'index' ||
      page.data.path === 'home' ||
      page.filePath?.endsWith('index.md') ||
      page.filePath?.endsWith('index.mdx')
    ) {
      return {
        href: sanitizeUrl(
          `${site}${alternate.language === 'en' ? '' : alternate.language + trailingSlash}`
        ),
        hreflang: alternate.language
      };
    }
    return {
      href: sanitizeUrl(
        `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}${slugify(alternate.path?.split('/').at(-1) ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
      ),
      hreflang: alternate.language
    };
  });
}

export async function getPostLanguagesAlternates(
  post: CollectionEntry<'blog'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
): Promise<ReadonlyArray<HrefLang>> {
  const alternatePosts = await languageAlternates('blog', post.filePath);

  return alternatePosts.map((alternatePost) => {
    const { data: alternate } = alternatePost;
    return {
      // `blog/`, not `posts/` — this built URLs the site has never served.
      // Nothing caught it because no page passed these alternates to a layout.
      href: sanitizeUrl(
        `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}blog/${slugify(alternate.path ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
      ),
      hreflang: alternate.language
    };
  });
}

export async function getTourTagLanguagesAlternates(
  tourTag: CollectionEntry<'tourTags'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternateTourTags = await languageAlternates(
    'tourTags',
    tourTag.filePath
  );

  return alternateTourTags.map(({ data: alternateTourTag }) => ({
    href: sanitizeUrl(
      `${site}${alternateTourTag.language === 'en' ? '' : alternateTourTag.language + '/'}${PermalinkData.tours[alternateTourTag.language ?? 'en']}/tags/${slugify(alternateTourTag.path ?? alternateTourTag.name ?? alternateTourTag.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternateTourTag.language
  }));
}

export async function getBlogTagLanguagesAlternates(
  postTag: CollectionEntry<'postTags'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternatePostTags = await languageAlternates(
    'postTags',
    postTag.filePath
  );

  return alternatePostTags.map(({ data: alternatePostTag }) => ({
    href: sanitizeUrl(
      `${site}${alternatePostTag.language === 'en' ? '' : alternatePostTag.language + '/'}blog/tags/${slugify(alternatePostTag.path ?? alternatePostTag.name ?? alternatePostTag.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternatePostTag.language
  }));
}

export async function getTourRegionLanguagesAlternates(
  tourRegion: CollectionEntry<'tourRegions'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternateTourRegions = await languageAlternates(
    'tourRegions',
    tourRegion.filePath
  );

  return alternateTourRegions.map(({ data: alternateTourRegion }) => ({
    href: sanitizeUrl(
      `${site}${alternateTourRegion.language === 'en' ? '' : alternateTourRegion.language + '/'}${PermalinkData.tours[alternateTourRegion.language ?? 'en']}/regions/${slugify(alternateTourRegion.path ?? alternateTourRegion.name ?? alternateTourRegion.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternateTourRegion.language
  }));
}

export async function getTourLanguagesAlternates(
  tour: CollectionEntry<'tours'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
): Promise<ReadonlyArray<HrefLang>> {
  const alternateTours = await languageAlternates('tours', tour.filePath);

  return alternateTours.map(({ data: alternateTour }) => ({
    href: sanitizeUrl(
      `${site}${alternateTour.language === 'en' ? '' : alternateTour.language + '/'}${PermalinkData.tours[alternateTour.language ?? 'en']}/${slugify(alternateTour.path ?? alternateTour.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternateTour.language
  }));
}

export async function getBlogIndexPage(language: LanguageCodes) {
  const blogIndexes = await getCollection(
    'pages',
    (p) =>
      (p.filePath ?? '').endsWith('blog.mdx') && p.data.language === language
  );

  return blogIndexes[0];
}
