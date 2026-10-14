import {
  GOOGLE_TAG_MANAGER_HOST,
  GOOGLE_TAG_MANAGER_ID
} from 'astro:env/client';

/**
 * Normalise a hostname for comparison: case-folded, `www.` stripped, and any
 * stray port or trailing dot removed. `www.topbiketoursportugal.com` already
 * 301s to the apex at the edge, so a visitor's hostname is normally the apex
 * by the time a page renders — but the redirect is Netlify configuration, not
 * something this code controls, so the comparison does not depend on it.
 */
function normaliseHost(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.$/, '')
    .replace(/:\d+$/, '')
    .replace(/^www\./, '');
}

/**
 * True when the page is being served from the hostname that owns the Google
 * Tag Manager container configured for this build.
 *
 * Both this repo's sites inherit the same `GOOGLE_TAG_MANAGER_ID` default, and
 * every deploy preview is a byte-for-byte copy of the production build, so the
 * container ID alone cannot say whether a given page should be measured. The
 * hostname can, and it is available only at runtime — hence a function rather
 * than a build-time constant.
 *
 * Returns false on the server (no `window`): the container is injected
 * client-side in every code path, so there is nothing for an SSR caller to do.
 */
export function isTagManagerHost(): boolean {
  if (typeof window === 'undefined') return false;
  if (!GOOGLE_TAG_MANAGER_ID || !GOOGLE_TAG_MANAGER_HOST) return false;

  return (
    normaliseHost(window.location.hostname) ===
    normaliseHost(GOOGLE_TAG_MANAGER_HOST)
  );
}
