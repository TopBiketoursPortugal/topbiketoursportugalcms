import type { LanguageCodes } from 'src/schemas/language';
import { t } from 'utils/i18n';
import { getHomePermalink, getBasePath } from 'utils/permalinks';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

// Slugs of pages/hiking-tours-portugal.mdx and pages/about-us.mdx per language
// folder. Keep in step with the `path` frontmatter of those files.
const toursPagePaths: Record<LanguageCodes, string> = {
  en: '/hiking-tours-portugal/',
  pt: '/pt/passeios-pedestres-portugal/',
  de: '/de/wanderreisen-portugal/',
  es: '/es/rutas-de-senderismo-portugal/',
  fr: '/fr/randonnees-portugal/',
  nl: '/nl/wandelreizen-portugal/'
};

const aboutPagePaths: Record<LanguageCodes, string> = {
  en: '/about-us/',
  pt: '/pt/sobre-nos/',
  de: '/de/ueber-uns/',
  es: '/es/sobre-nosotros/',
  fr: '/fr/a-propos/',
  nl: '/nl/over-ons/'
};

export function getHomeCrumb(language: LanguageCodes): BreadcrumbItem {
  return {
    name: t('Breadcrumb.Home', language),
    url: getHomePermalink(language)
  };
}

export function getToursCrumb(language: LanguageCodes): BreadcrumbItem {
  return {
    name: t('Breadcrumb.Tours', language),
    url: toursPagePaths[language]
  };
}

export function getBlogCrumb(language: LanguageCodes): BreadcrumbItem {
  return {
    name: t('Breadcrumb.Blog', language),
    url: `${getBasePath(language)}blog/`
  };
}

export function getAboutCrumb(language: LanguageCodes): BreadcrumbItem {
  return {
    name: t('Breadcrumb.About', language),
    url: aboutPagePaths[language]
  };
}
