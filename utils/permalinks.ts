import slugify from 'slugify';
import { type LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';

function getBasePath(language: LanguageCodes = 'en'): string {
  return language === 'en' ? '/' : `/${language}/`;
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}team/${slugify(memberName)}`;
}

export function getTourPath(
  { slug, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/${slug ?? slugify(title)}`;
}

export function getTourRegionsPath(
  region: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}tours/regions/${slugify(region)}`;
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
  const home = getBasePath(language);
  return home.length > 1 ? trimSlash(home) : home;
}
