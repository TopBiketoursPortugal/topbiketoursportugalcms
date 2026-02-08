import type { LanguageCodes } from 'src/schemas/language';
import { t } from 'utils/i18n';
import { getHomePermalink, getBasePath } from 'utils/permalinks';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

const toursPagePaths: Record<LanguageCodes, string> = {
  en: '/bike-tours-in-portugal/',
  pt: '/pt/passeios-de-bicicleta-portugal/'
};

const aboutPagePaths: Record<LanguageCodes, string> = {
  en: '/about-us-biking-travel/',
  pt: '/pt/sobre-nos/'
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
