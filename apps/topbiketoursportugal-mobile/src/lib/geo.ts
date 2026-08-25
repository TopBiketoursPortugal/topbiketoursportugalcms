const EARTH_RADIUS_M = 6371000;

export type LatLng = { lat: number; lng: number };

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points, in metres. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Initial bearing from `a` to `b` in degrees, 0–360 clockwise from north. */
export function bearingDegrees(a: LatLng, b: LatLng): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function formatDistance(meters: number): string {
  if (meters < 950) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Index of the "next" stop ahead of a live position, by straight-line
 * distance to the nearest waypoint — shared by the stop-to-stop cue sheet
 * (TurnByTurnCue) and the "open in Waze/Google Maps" handoff, which both
 * need "what's the rider probably headed to" without a real GPX track.
 */
export function nextWaypointIndex(
  waypoints: LatLng[],
  position: LatLng | null
): number {
  if (!position || waypoints.length < 2) return waypoints.length > 1 ? 1 : 0;
  let closest = 0;
  let closestDistance = Infinity;
  waypoints.forEach((wp, i) => {
    const d = distanceMeters(position, wp);
    if (d < closestDistance) {
      closestDistance = d;
      closest = i;
    }
  });
  return Math.min(closest + 1, waypoints.length - 1);
}
