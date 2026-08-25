/**
 * MapLibre renders from a *style* — a JSON document pointing at real vector
 * tiles — not a "give me OpenStreetMap" flag. Style URLs come from a tile
 * provider (MapTiler, Stadia Maps, Mapbox all publish MapLibre-compatible
 * ones); most require a free or paid API key, and bulk/offline downloading
 * against a provider's tiles is only allowed under their own terms.
 *
 * Nothing is hardcoded here on purpose — see .env.example. Set
 * EXPO_PUBLIC_MAP_STYLE_URL to light up the live map and offline downloads;
 * until it's set, the Route tab shows an honest empty state instead of
 * silently failing (or scraping a tile server without permission).
 */
export const MAP_STYLE_URL = process.env.EXPO_PUBLIC_MAP_STYLE_URL || null;

export function hasMapStyle(): boolean {
  return !!MAP_STYLE_URL;
}
