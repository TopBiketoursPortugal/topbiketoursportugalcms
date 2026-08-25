import SiteData from 'src/../data/site.json';
import Languages from 'src/../data/languages.json';
import type { LanguageCodes } from 'src/schemas/language';
import type { SEOProps } from 'astro-seo';
import type { LayoutProps } from 'src/layouts/Layout.astro';
import { sanitizeUrl } from './permalinks';
import { getImageByPath } from './get-image';

export async function getPageSeo(
  site: string | URL,
  page: LayoutProps,
  language: LanguageCodes,
  pageUrl?: URL
): Promise<SEOProps> {
  const { seo } = page;
  const pageTitle = page.seo?.page_title ?? page.title;
  const siteData = SiteData[language];
  const siteName = siteData.site.name;
  const titleTemplate = siteData.metadata.title.template;
  const title = pageTitle
    ? pageTitle.includes(siteName)
      ? pageTitle
      : titleTemplate.replace('%s', pageTitle)
    : siteData.site_title;

  const baseUrl = site ?? import.meta.env.BASE_URL;
  const description = seo?.page_description ?? siteData.description;
  const image = seo?.featured_image ?? siteData.image.src;
  const image_alt = seo?.featured_image_alt ?? siteData.image.alt;

  // Absolute URL of the page being rendered; falls back to the site root.
  const currentUrl = pageUrl
    ? new URL(pageUrl.pathname, baseUrl)
    : new URL(String(baseUrl));

  // Every indexable page gets a canonical: explicit override or self.
  const canonicalURL = seo?.canonical_url
    ? new URL(seo.canonical_url, baseUrl)
    : currentUrl;

  const ogLocale = (Languages[language]?.locale ?? 'en-US').replace('-', '_');

  const imageGenerated = (await getImageByPath(image)).default.src;

  return {
    noindex: seo?.no_index ?? false,
    title,
    description,
    canonical: canonicalURL,
    openGraph: {
      basic: {
        title,
        url: currentUrl.href,
        type: `${seo?.open_graph_type || 'website'}`,
        image: sanitizeUrl(`${baseUrl}${imageGenerated}`)
      },
      optional: {
        description: description,
        siteName,
        locale: ogLocale
      },
      image: {
        url: sanitizeUrl(`${baseUrl}${imageGenerated}`),
        alt: image_alt
      }
    },
    twitter: {
      creator: `${seo?.author_twitter_handle || siteData.twitter_site}`,
      site: `${siteData.twitter_site}`,
      card: 'summary_large_image'
    }
  } as SEOProps;
}
