import type { LatLng } from './geo';

/** A single street-level turn, e.g. "Turn left" in 300m. */
export type Maneuver = {
  /** [lat, lng] where the maneuver happens. */
  at: [number, number];
  distanceFromStartM: number;
  // 'straight' only ever comes from a live-recomputed route (src/lib/directions.ts)
  // — the offline GPX pipeline never emits a maneuver for a sub-threshold turn.
  turn:
    'left' | 'right' | 'slight-left' | 'slight-right' | 'u-turn' | 'straight';
  instruction: string;
};

/**
 * A real ridden route, precomputed offline by scripts/gpx-to-track.mjs from
 * a GPX file — everything here is baked in at build time, so using it on
 * the Route tab needs no network and no on-device GPX parsing.
 */
/** Real elevation data from the GPX's <ele> tags, sampled every `stepM` along the route. */
export type ElevationData = {
  stepM: number;
  /** Metres above sea level, index i = i * stepM from the start. */
  samples: number[];
  minM: number;
  maxM: number;
  ascentM: number;
  descentM: number;
};

export type PrecomputedTrack = {
  totalDistanceM: number;
  /** null when the GPX carried no <ele> data (or a live-recomputed detour, which has none). */
  elevation?: ElevationData | null;
  /** [lat, lng] pairs, thinned for bundle size / snap-to-route cost. */
  track: [number, number][];
  /** Cumulative metres from the start, parallel to `track`. */
  trackCumDist: number[];
  maneuvers: Maneuver[];
};

/** How far off the matched track counts as "off route" — beyond normal GPS drift. */
export const OFF_ROUTE_THRESHOLD_M = 60;

export type SnapResult = {
  /** How far along the route the live position projects to, in metres. */
  progressDistanceM: number;
  /** Perpendicular distance from the live position to the matched track segment. */
  offRouteM: number;
};

const EARTH_RADIUS_M = 6371000;
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Projects a live GPS fix onto the nearest segment of a precomputed track —
 * "where on the route am I" (for the maneuver countdown) and "how far off
 * the route am I" (for an off-route warning). Brute-force over every
 * segment: fine at these track sizes (a few hundred to a couple thousand
 * points after thinning) and this update rate (only on ~5m of movement,
 * not per animation frame).
 */
export function snapToTrack(
  position: LatLng,
  precomputed: PrecomputedTrack
): SnapResult {
  const { track, trackCumDist } = precomputed;
  if (track.length < 2) return { progressDistanceM: 0, offRouteM: Infinity };

  // Local equirectangular projection around the fix — a flat-plane
  // approximation, accurate enough at the scale of a single route.
  const lat0 = toRad(position.lat);
  const toXY = (lat: number, lng: number) => ({
    x: toRad(lng) * Math.cos(lat0) * EARTH_RADIUS_M,
    y: toRad(lat) * EARTH_RADIUS_M
  });
  const p = toXY(position.lat, position.lng);

  let bestDist = Infinity;
  let bestProgress = 0;
  for (let i = 0; i < track.length - 1; i++) {
    const a = toXY(track[i][0], track[i][1]);
    const b = toXY(track[i + 1][0], track[i + 1][1]);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    const t =
      len2 === 0
        ? 0
        : Math.max(
            0,
            Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2)
          );
    const cx = a.x + t * dx;
    const cy = a.y + t * dy;
    const dist = Math.hypot(p.x - cx, p.y - cy);
    if (dist < bestDist) {
      bestDist = dist;
      bestProgress =
        trackCumDist[i] + t * (trackCumDist[i + 1] - trackCumDist[i]);
    }
  }
  return { progressDistanceM: bestProgress, offRouteM: bestDist };
}

/** The next maneuver ahead of the rider's current progress along the route. */
export function nextManeuver(
  precomputed: PrecomputedTrack,
  progressDistanceM: number
): Maneuver | null {
  // Small backward buffer so we don't instantly re-show the maneuver just passed.
  return (
    precomputed.maneuvers.find(
      (m) => m.distanceFromStartM > progressDistanceM - 5
    ) ?? null
  );
}
