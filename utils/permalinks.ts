import { getCollection, type CollectionEntry } from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';
import type { HrefLang } from 'src/types/hreflang';
import PermalinkData from 'src/../data/permalinks.json';

const doublSlashRegex = /([^:])\/{2,}/g;

export const trailingSlash = '/';

function sanitizeUrl(url: string) {
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
    `${getBasePath(language)}${tourPermalink}/regions/${slugify(region.data.name ?? region.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
  );
}

export function getTourTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const tourPermalink = PermalinkData.tours[language];

  const path = `${getBasePath(language)}${tourPermalink}/tags/${slugify(tag, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

export function getBlogTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const path = `${getBasePath(language)}tags/${slugify(tag, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
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

export async function getTeamLanguagesAlternates(
  pageEntry: CollectionEntry<'team'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const teamPages = await getCollection('team');
  const alternateEntryName = pageEntry.filePath?.split('/').at(-1)!;

  var alternatePages =
    teamPages.filter(
      (t) =>
        t.data.language !== pageEntry.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

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
  const pages = await getCollection('pages');
  const alternateEntryName = pageEntry.filePath?.split('/').at(-1)!;

  var alternatePages =
    pages.filter(
      (t) =>
        t.data.language !== pageEntry.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

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
  const posts = await getCollection('blog');
  const alternateEntryName = post.filePath?.split('/').at(-1)!;
  var alternatePosts =
    posts.filter(
      (t) =>
        t.data.language !== post.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

  return alternatePosts.map((alternatePost) => {
    const { data: alternate } = alternatePost;
    return {
      href: sanitizeUrl(
        `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}posts/${slugify(alternate.path ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
      ),
      hreflang: alternate.language
    };
  });
}

export async function getTourRegionLanguagesAlternates(
  tourRegion: CollectionEntry<'tourRegions'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const tourRegions = await getCollection('tourRegions');
  const alternateEntryName = tourRegion.filePath?.split('/').at(-1)!;

  var alternateTourRegions =
    tourRegions.filter(
      (t) =>
        t.data.language !== tourRegion.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

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
  const tours = await getCollection('tours');
  const alternateEntryName = tour.filePath?.split('/').at(-1)!;

  var alternateTours =
    tours.filter(
      (t) =>
        t.data.language !== tour.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

  return alternateTours.map(({ data: alternateTour }) => ({
    href: sanitizeUrl(
      `${site}${alternateTour.language === 'en' ? '' : alternateTour.language + '/'}${PermalinkData.tours[alternateTour.language ?? 'en']}/${slugify(alternateTour.path ?? alternateTour.title, { lower: true, strict: true, trim: true })}${trailingSlash}`
    ),
    hreflang: alternateTour.language
  }));
}

export async function getBlogIndexPage(language: LanguageCodes) {
  const blogIndexes = await getCollection('pages', (p) => {
    return (
      (p.filePath ?? '').endsWith('blog.mdx') && p.data.language === language
    );
  });

  return blogIndexes[0];
}
