import SiteData from 'src/../data/site.json';
import type { LanguageCodes } from 'src/schemas/language';
import type { SEOProps } from 'astro-seo';
import type { LayoutProps } from 'src/layouts/Layout.astro';

export function getPageSeo(
  site: string | URL,
  page: LayoutProps,
  language: LanguageCodes
): SEOProps {
  const { seo } = page;
  const pageTitle = page.seo?.page_title ?? page.title;
  const siteData = SiteData[language];
  const title = pageTitle
    ? `${pageTitle} | ${siteData.site_title}`
    : siteData.site_title;

  const baseUrl = site ?? import.meta.env.BASE_URL;
  const description = seo?.page_description ?? siteData.description;
  const image = seo?.featured_image ?? siteData.image.src;
  const image_alt = seo?.featured_image_alt ?? siteData.image.alt;
  const canonicalURL = seo?.canonical_url
    ? new URL(seo?.canonical_url, baseUrl)
    : undefined;

  return {
    noindex: seo?.no_index || false,
    title,
    description,
    canonical: canonicalURL,
    openGraph: {
      basic: {
        title,
        url: baseUrl,
        type: `${seo?.open_graph_type || 'website'}`,
        image: `${baseUrl}${image}`
      },
      optional: {
        description: description
      },
      image: {
        url: `${baseUrl}${image}`,
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
