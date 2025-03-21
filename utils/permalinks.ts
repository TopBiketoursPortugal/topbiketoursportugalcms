import { getCollection, type CollectionEntry } from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';
import type { HrefLang } from 'src/types/hreflang';

export const trailingSlash = '/';

export function getBasePath(language: LanguageCodes = 'en'): string {
  return language === 'en' ? '/' : `/${language}/`;
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}team/${slugify(memberName, { lower: true, strict: true, trim: true })}${trailingSlash}`;
}

export function getTourPath(
  { slug, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/${slugify(slug ?? title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
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
    href: `${site}${alternateTour.language === 'en' ? '' : alternateTour.language + '/'}tours/${slugify(alternateTour.slug ?? alternateTour.title, { lower: true, strict: true, trim: true })}${trailingSlash}`,
    hreflang: alternateTour.language
  }));
}

export function getTourRegionsPath(
  region: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/regions/${slugify(region, { lower: true, strict: true, trim: true })}${trailingSlash}`;
}

export function getTourTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const slug = `${getBasePath(language)}tours/tags/${slugify(tag, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return slug;
}

export function getBlogTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const slug = `${getBasePath(language)}tags/${slugify(tag, { lower: true, strict: true, trim: true })}${trailingSlash}`;
  return slug;
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
  return language === 'en' ? '/' : `/${language}${trailingSlash}`;
}

export function getPagePath(page: CollectionEntry<'pages'>) {
  const language = page.data.language ?? 'en';

  if (
    // page.data.slug === '' ||
    page.data.slug === 'index' ||
    page.data.slug === 'home' ||
    page.filePath?.endsWith('index.md') ||
    page.filePath?.endsWith('index.mdx')
  ) {
    return getHomePermalink(language);
  }
  const pagePath =
    `${getBasePath(language)}${slugify(page.data.slug ?? page.data.title, { lower: true, strict: true, trim: true }).replace(/index$/, '')}${trailingSlash}`.toLocaleLowerCase();
  return pagePath;
}

export function getBlogPagePath(
  pageNum: number,
  language: LanguageCodes = 'en',
  site: URL = new URL('https://topwalkingtoursportual.com')
): string {
  const pagePath = pageNum === 1 ? '' : `/${pageNum}`;
  return `${getHomePermalink(language)}blog${pagePath}${trailingSlash}`;
}

export function getBlogPermalink({ data }: CollectionEntry<'blog'>): string {
  const language = data.language ?? 'en';
  return `${getBasePath(language)}blog/${slugify(data.slug ?? data.title, { lower: true, strict: true, trim: true })}${trailingSlash}`;
}

export async function getPageLanguagesAlternates(
  tour: CollectionEntry<'pages'>,
  site: URL = new URL('https://topwalkingtoursportual.com')
): Promise<ReadonlyArray<HrefLang>> {
  const pages = await getCollection('pages');
  const alternateEntryName = tour.filePath?.split('/').at(-1)!;
  var alternatePages =
    pages.filter(
      (t) =>
        t.data.language !== tour.data.language &&
        t.filePath?.endsWith(alternateEntryName)
    ) ?? [];

  return alternatePages.map((page) => {
    const { data: alternate } = page;
    if (
      page.data.slug === 'index' ||
      page.data.slug === 'home' ||
      page.filePath?.endsWith('index.md') ||
      page.filePath?.endsWith('index.mdx')
    ) {
      return {
        href: getHomePermalink(page.data.language),
        hreflang: alternate.language
      };
    }
    return {
      href: `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}${slugify(alternate.slug ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`,
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
      href: `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}posts/${slugify(alternate.slug ?? alternate.title, { lower: true, strict: true, trim: true })}${trailingSlash}`,
      hreflang: alternate.language
    };
  });
}
