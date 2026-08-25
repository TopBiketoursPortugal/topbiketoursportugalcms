import { Linking } from 'react-native';

import type { LatLng } from './geo';

/**
 * Hands off to Waze or Google Maps for a rider who'd rather use an app
 * they already trust than Rota's own turn-by-turn. Both use each
 * service's universal web link rather than a custom URL scheme (waze://,
 * comgooglemaps://) — that opens the installed app directly if present,
 * or falls back to the web/store automatically, with no native
 * Info.plist/AndroidManifest scheme declaration needed on our side.
 */

export function openInWaze(target: LatLng) {
  Linking.openURL(
    `https://waze.com/ul?ll=${target.lat},${target.lng}&navigate=yes`
  ).catch((err) => {
    console.warn('[Rota] could not open Waze:', err);
  });
}

export function openInGoogleMaps(target: LatLng) {
  Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=bicycling`
  ).catch((err) => {
    console.warn('[Rota] could not open Google Maps:', err);
  });
}
