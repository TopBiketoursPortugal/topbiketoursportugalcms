import type { CollectionEntry } from 'astro:content';
import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';

export function getBasePath(language: LanguageCodes = 'en'): string {
  return language === 'en' ? '/' : `/${language}/`;
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}team/${slugify(memberName, { lower: true })}`;
}

export function getTourPath(
  { slug, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/${slug ?? slugify(title, { lower: true })}`;
}

export function getTourRegionsPath(
  region: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/regions/${slugify(region, { lower: true })}`;
}

export function getTourTagPath(
  tag: string,
  language: LanguageCodes = 'en'
): string {
  const slug = `${getBasePath(language)}tours/tags/${slugify(tag, { lower: true })}`;
  // console.log('tag slug:', slug);
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
  // console.log(`page slug ${page.slug}`);
  // console.log(`filePath ${page.filePath}`);

  const language = page.data.language ?? 'en';

  if (
    page.slug === 'index' ||
    page.slug === 'home' ||
    page.filePath?.endsWith('index.md')
  ) {
    return getHomePermalink(language);
  }
  const pagePath =
    `${getBasePath(language)}${page.data.slug ?? slugify(page.data.title, { lower: true }).replace(/index$/, '')}`.toLocaleLowerCase();
  // console.log(pagePath);
  return pagePath;
}
