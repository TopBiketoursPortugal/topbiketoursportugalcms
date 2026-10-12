import SiteData from 'src/../data/site.json';
import Languages from 'src/../data/languages.json';
import type { LanguageCodes } from 'src/schemas/language';
import type { SEOProps } from 'astro-seo';
import type { LayoutProps } from 'src/layouts/Layout.astro';
import { sanitizeUrl } from './permalinks';
import { getImageByPath } from './get-image';

// The width Google renders before truncating a title with an ellipsis. It is
// a pixel budget rather than a character count, so this is the usual
// conservative character proxy, not an exact cutoff.
const TITLE_CHAR_BUDGET = 60;

function withBrandSuffix(
  pageTitle: string,
  template: string,
  templateShort?: string
): string {
  const candidates = [template, templateShort].filter(
    (t): t is string => typeof t === 'string' && t.length > 0
  );
  for (const candidate of candidates) {
    const withSuffix = candidate.replace('%s', pageTitle);
    if (withSuffix.length <= TITLE_CHAR_BUDGET) return withSuffix;
  }
  return pageTitle;
}

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
  const titleTemplateShort = siteData.metadata.title.template_short;
  // Google shows roughly 60 characters of a title. Appending the full 26-char
  // brand suffix unconditionally pushed 164 of 236 titles past that, and the
  // suffix is at the end, so the part Google cut off was the brand itself —
  // we lost the branding AND the end of the description. Take the longest
  // suffix that still fits; if even the short one does not, ship the authored
  // title alone. That leaves 34 titles over 60, all of which are already over
  // 60 before any suffix — those are a copy-length fix, not a template one.
  const title = pageTitle
    ? pageTitle.includes(siteName)
      ? pageTitle
      : withBrandSuffix(pageTitle, titleTemplate, titleTemplateShort)
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
