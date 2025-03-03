import slugify from 'slugify';
import type { LanguageCodes } from 'src/schemas/language';
import type { TourSchema } from 'src/schemas/tours';

function getBasePath(language: LanguageCodes = 'en'): string {
  return language === 'en' ? '' : '/' + language;
}

export function getTeamMemberPath(
  memberName: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}/team/${slugify(memberName)}`;
}

export function getTourPath(
  { slug, title }: TourSchema,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}/tours/${slug ?? slugify(title)}`;
}

export function getTourRegionsPath(
  region: string,
  language: LanguageCodes = 'en'
): string {
  return `${getBasePath(language)}/tours/regions/${slugify(region)}`;
}
