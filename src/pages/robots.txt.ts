import type { APIRoute } from 'astro';
import { INDEX } from 'astro:env/client';

const getRobotsTxt = (sitemapURL: URL) => `
User-Agent: *
Disallow:

Sitemap: ${sitemapURL.href}
`;

/**
 * Deploy previews and branch deploys served this file with `Disallow:` (allow
 * everything) and a sitemap pointing at production, so the whole site was
 * crawlable from topbiketoursportugal.netlify.app and every
 * `*--boring-kepler-5712ff.netlify.app` host — a duplicate of the live site,
 * open to indexing.
 *
 * No sitemap is advertised here: a non-production host has nothing it wants
 * crawled, and the production sitemap listing production URLs would be
 * meaningless on this hostname.
 */
const getNoCrawlRobotsTxt = () => `
User-Agent: *
Disallow: /
`;

export const GET: APIRoute = ({ site }) => {
  if (INDEX === 'false') {
    return new Response(getNoCrawlRobotsTxt());
  }

  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
