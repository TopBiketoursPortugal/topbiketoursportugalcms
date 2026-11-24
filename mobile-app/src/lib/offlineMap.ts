import {
  OfflineManager,
  type LngLatBounds,
  type OfflinePack
} from '@maplibre/maplibre-react-native';

/** Find a previously downloaded pack for this tour, if any (matched by our own metadata, not id — MapLibre auto-generates ids). */
export async function findTourOfflinePack(
  tourId: string
): Promise<OfflinePack | undefined> {
  const packs = await OfflineManager.getPacks();
  return packs.find((p) => p.metadata?.tourId === tourId);
}

export async function downloadTourOfflinePack(
  tourId: string,
  bounds: LngLatBounds,
  mapStyle: string,
  onProgress: (percent: number) => void
): Promise<void> {
  const existing = await findTourOfflinePack(tourId);
  if (existing) {
    await OfflineManager.deletePack(existing.id);
  }

  await OfflineManager.createPack(
    {
      mapStyle,
      bounds,
      // Zoomed out enough to cover a whole multi-day route without an
      // enormous tile count, detailed enough to read street names when
      // zoomed in at a stop. Tune per tour if some need closer detail.
      minZoom: 8,
      maxZoom: 14,
      metadata: { tourId }
    },
    (_pack, status) => onProgress(status.percentage),
    (_pack, error) => {
      console.warn(`[Rota] offline pack error for ${tourId}:`, error.message);
    }
  );
}

export async function deleteTourOfflinePack(tourId: string): Promise<void> {
  const existing = await findTourOfflinePack(tourId);
  if (existing) await OfflineManager.deletePack(existing.id);
}

/** Bounding box around a set of waypoints, padded ~10% so the route isn't flush against the tile edge. */
export function boundsForWaypoints(
  waypoints: { lat: number; lng: number }[]
): LngLatBounds {
  const lats = waypoints.map((w) => w.lat);
  const lngs = waypoints.map((w) => w.lng);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];

  const padLat = Math.max((maxLat - minLat) * 0.1, 0.02);
  const padLng = Math.max((maxLng - minLng) * 0.1, 0.02);

  return [minLng - padLng, minLat - padLat, maxLng + padLng, maxLat + padLat];
}
