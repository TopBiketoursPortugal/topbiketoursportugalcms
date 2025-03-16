import { getCollection, type CollectionEntry } from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';
import type { HrefLang } from 'src/types/hreflang';

export function getBasePath(language: LanguageCodes = 'en'): string {
  return language === 'en' ? '/' : `/${language}/`;
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}team/${slugify(memberName, { lower: true, strict: true, trim: true })}`;
}

export function getTourPath(
  { slug, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/${slug ?? slugify(title, { lower: true, strict: true, trim: true })}`;
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
    href: `${site}${alternateTour.language === 'en' ? '' : alternateTour.language + '/'}tours/${alternateTour.slug ?? slugify(alternateTour.title, { lower: true, strict: true, trim: true })}`,
    hreflang: alternateTour.language
  }));
}

export function getTourRegionsPath(
  region: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/regions/${slugify(region, { lower: true, strict: true, trim: true })}`;
}

export function getTourTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const slug = `${getBasePath(language)}tours/tags/${slugify(tag, { lower: true, strict: true, trim: true })}`;
  return slug;
}

export function getBlogTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const slug = `${getBasePath(language)}tags/${slugify(tag, { lower: true, strict: true, trim: true })}`;
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
  return language === 'en' ? '/' : `/${language}`;
}

export function getPagePath(page: CollectionEntry<'pages'>) {
  const language = page.data.language ?? 'en';

  if (
    // page.data.slug === '/' ||
    // page.data.slug === '' ||
    page.slug === '' ||
    page.slug === 'index' ||
    page.slug === 'home' ||
    page.filePath?.endsWith('index.md') ||
    page.filePath?.endsWith('index.mdx')
  ) {
    return getHomePermalink(language);
  }
  const pagePath =
    `${getBasePath(language)}${page.data.slug ?? slugify(page.data.title, { lower: true, strict: true, trim: true }).replace(/index$/, '')}`.toLocaleLowerCase();
  return pagePath;
}

export function getBlogPermalink({ data }: CollectionEntry<'blog'>): string {
  const language = data.language ?? 'en';
  return `${getBasePath(language)}blog/${slugify(data.slug ?? data.title, { lower: true, strict: true, trim: true })}`;
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
      page.slug === 'index' ||
      page.slug === 'home' ||
      page.filePath?.endsWith('index.md')
    ) {
      return {
        href: getHomePermalink(page.data.language),
        hreflang: alternate.language
      };
    }
    return {
      href: `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}${alternate.slug ?? slugify(alternate.title, { lower: true, strict: true, trim: true })}`,
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
      href: `${site}${alternate.language === 'en' ? '' : alternate.language + '/'}posts/${alternate.slug ?? slugify(alternate.title, { lower: true, strict: true, trim: true })}`,
      hreflang: alternate.language
    };
  });
}
