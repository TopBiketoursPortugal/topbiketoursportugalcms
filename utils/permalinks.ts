import { getCollection, type CollectionEntry } from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';
import type { HrefLang } from 'src/types/hreflang';
import PermalinkData from 'src/../data/permalinks.json';

const doublSlashRegex = /([^:])\/{2,}/g;

import { getInternalDomains } from './domains';

export const trailingSlash = '/';

export const externalLinksConfig = {
  externalTarget: '_blank',
  externalRel: 'nofollow noopener noreferrer',
  internalTarget: '',
  internalRel: '',
  internalDomains: getInternalDomains()
};

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

  const path = `${getBasePath(language)}${tourPermalink}/tags/${slugify(tag.data.name ?? tag.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return sanitizeUrl(path);
}

export function getBlogTagPath(
  tag: CollectionEntry<'postTags'>,
  language: LanguageCodes = 'en'
): string {
  const path = `${getBasePath(language)}blog/tags/${slugify(tag.data.name ?? tag.data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
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
  const alternateEntryName = pageEntry.filePath?.split('/').at(-1)!;
  const alternatePages =
    (await getCollection(
      'team',
      (t) =>
        // t.data.language !== pageEntry.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
  const alternateEntryName = pageEntry.filePath?.split('/').at(-1)!;
  const alternatePages =
    (await getCollection(
      'pages',
      (t) =>
        // t.data.language !== pageEntry.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
  const alternateEntryName = post.filePath?.split('/').at(-1)!;
  const alternatePosts =
    (await getCollection(
      'blog',
      (t) =>
        // t.data.language !== post.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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

export async function getTourTagLanguagesAlternates(
  tourTag: CollectionEntry<'tourTags'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
) {
  const alternateEntryName = tourTag.filePath?.split('/').at(-1)!;
  const alternateTourTags =
    (await getCollection(
      'tourTags',
      (t) =>
        // t.data.language !== tourTag.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
  const alternateEntryName = postTag.filePath?.split('/').at(-1)!;
  const alternatePostTags =
    (await getCollection(
      'postTags',
      (t) =>
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
  const alternateEntryName = tourRegion.filePath?.split('/').at(-1)!;
  const alternateTourRegions =
    (await getCollection(
      'tourRegions',
      (t) =>
        // t.data.language !== tourRegion.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
  const alternateEntryName = tour.filePath?.split('/').at(-1)!;
  const alternateTours =
    (await getCollection(
      'tours',
      (t) =>
        // t.data.language !== tour.data.language &&
        t.filePath?.split('/').at(-1) === alternateEntryName
    )) ?? [];

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
