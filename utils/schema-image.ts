import { getImageByPath } from './get-image';

/**
 * Turn an image reference into an absolute URL Google can actually fetch.
 *
 * Content frontmatter stores images as source paths (`/src/assets/images/x.jpg`).
 * Those exist only at build time — emitting one into structured data gives
 * Google a 404, and an unfetchable image makes the whole rich result
 * ineligible. Every schema component funnels through here so that cannot be
 * reintroduced one component at a time.
 *
 * Assets are served from the origin, never from a localised root: building
 * against `SiteData.pt.site.url` produced `/pt/_astro/…`, which also 404s.
 *
 * Returns null when the reference cannot be resolved — omitting the property
 * is valid, emitting a broken URL is not.
 */
export async function resolveSchemaImage(
  source: string | null | undefined,
  site: URL | string | undefined
): Promise<string | null> {
  if (!source) return null;
  if (source.startsWith('http')) return source;

  const origin = site ? new URL(site.toString()).origin : '';

  try {
    const built = (await getImageByPath(source)).default.src;
    return origin ? new URL(built, origin).href : built;
  } catch {
    // Not a src/assets file. A leftover source path has no built counterpart,
    // so drop it; anything else is a public/ path and resolves as-is.
    if (source.startsWith('/src/')) return null;
    return origin ? new URL(source, origin).href : source;
  }
}
