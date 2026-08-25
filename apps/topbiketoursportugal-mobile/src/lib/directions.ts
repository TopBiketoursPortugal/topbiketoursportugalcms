import { distanceMeters, type LatLng } from './geo';
import type { Maneuver, PrecomputedTrack } from './routeTrack';

/**
 * Live cycling directions from OpenRouteService — used ONLY for the
 * rider-triggered "Recompute" action when they've gone off the
 * precomputed route. Normal navigation stays fully offline (routeTrack.ts);
 * this is the one place in the app that needs a network connection.
 *
 * Needs EXPO_PUBLIC_ORS_API_KEY (free tier at openrouteservice.org/dev) —
 * see .env.example. Nothing is called without it.
 */
export const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY || null;

export function hasDirectionsApiKey(): boolean {
  return !!ORS_API_KEY;
}

// ORS instruction `type` codes → our coarse arrow categories.
// https://github.com/GIScience/openrouteservice: InstructionType.java
const ORS_TYPE_TO_TURN: Record<number, Maneuver['turn'] | null> = {
  0: 'left',
  1: 'right',
  2: 'left', // sharp left — no dedicated icon; closest category
  3: 'right', // sharp right
  4: 'slight-left',
  5: 'slight-right',
  6: 'straight',
  7: 'straight', // enter roundabout
  8: 'straight', // exit roundabout
  9: 'u-turn',
  10: null, // goal — not a maneuver
  11: null, // depart — not a maneuver
  12: 'slight-left', // keep left
  13: 'slight-right' // keep right
};

export type DirectionsError = 'no-key' | 'network' | 'no-route';
export type DirectionsResult =
  { ok: true; route: PrecomputedTrack } | { ok: false; error: DirectionsError };

// Minimal shape of the ORS directions/geojson response — only the fields we read.
interface OrsStep {
  type: number;
  way_points?: number[];
  instruction?: string;
}
interface OrsSegment {
  steps?: OrsStep[];
}
interface OrsResponse {
  features?: Array<{
    geometry?: { coordinates?: [number, number][] };
    properties?: {
      summary?: { distance?: number };
      segments?: OrsSegment[];
    };
  }>;
}

/** Calls ORS's cycling-regular profile for a route from `from` to `to`. */
export async function fetchCyclingRoute(
  from: LatLng,
  to: LatLng
): Promise<DirectionsResult> {
  if (!ORS_API_KEY) return { ok: false, error: 'no-key' };

  let res: Response;
  try {
    res = await fetch(
      'https://api.openrouteservice.org/v2/directions/cycling-regular/geojson',
      {
        method: 'POST',
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: [
            [from.lng, from.lat],
            [to.lng, to.lat]
          ]
        })
      }
    );
  } catch {
    return { ok: false, error: 'network' };
  }
  if (!res.ok)
    return { ok: false, error: res.status === 404 ? 'no-route' : 'network' };

  let json: OrsResponse;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: 'network' };
  }

  const feature = json?.features?.[0];
  const rawCoords: [number, number][] | undefined =
    feature?.geometry?.coordinates;
  if (!rawCoords || rawCoords.length < 2)
    return { ok: false, error: 'no-route' };

  // ORS returns [lng, lat]; PrecomputedTrack's convention (matching the GPX
  // pipeline) is [lat, lng].
  const track: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

  const trackCumDist: number[] = [0];
  for (let i = 1; i < track.length; i++) {
    trackCumDist.push(
      trackCumDist[i - 1] +
        distanceMeters(
          { lat: track[i - 1][0], lng: track[i - 1][1] },
          { lat: track[i][0], lng: track[i][1] }
        )
    );
  }
  const totalDistanceM = Math.round(
    feature.properties?.summary?.distance ?? trackCumDist.at(-1)
  );

  const steps: OrsStep[] =
    feature.properties?.segments?.flatMap((s: OrsSegment) => s.steps ?? []) ??
    [];
  const maneuvers: Maneuver[] = [];
  for (const step of steps) {
    const turn = ORS_TYPE_TO_TURN[step.type];
    const wp = step.way_points?.[0];
    if (!turn || wp === undefined || !track[wp]) continue;
    maneuvers.push({
      at: track[wp],
      distanceFromStartM: Math.round(trackCumDist[wp]),
      turn,
      instruction: step.instruction || `Turn ${turn}`
    });
  }

  return {
    ok: true,
    route: { totalDistanceM, track, trackCumDist, maneuvers }
  };
}
