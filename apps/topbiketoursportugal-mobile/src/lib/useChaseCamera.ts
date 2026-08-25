import type {
  CameraRef,
  GeolocationPosition
} from '@maplibre/maplibre-react-native';
import { type RefObject, useEffect, useRef } from 'react';

import { bearingDegrees, distanceMeters } from './geo';

/** Waze-style chase view: street-level zoom, steep tilt so the road ahead fills the screen. */
export const CHASE_ZOOM = 18;
export const CHASE_PITCH = 60;

/** Below this speed GPS "heading" is noise — hold the last good bearing instead of spinning the map. */
const MIN_SPEED_FOR_HEADING_MPS = 1;
/** Fallback: derive bearing from consecutive fixes when the OS gives none, if the rider actually moved. */
const MIN_MOVE_FOR_DERIVED_BEARING_M = 4;

type Padding = { top: number; right: number; bottom: number; left: number };

/**
 * Drives the map camera from JS on every GPS fix — centre on the rider,
 * zoom 18, 60° pitch, bearing = direction of travel — easing linearly
 * between fixes so the map glides rather than jumps.
 *
 * We do this in JS instead of MapLibre's native `trackUserLocation="course"`
 * because the native mode hands the camera to the SDK's LocationComponent,
 * which keeps whatever zoom the map currently has (our one-shot zoom prop
 * gets cancelled by its own tracking animation) and only rotates once the
 * OS reports a travel bearing. Owning the camera here gives a deterministic
 * chase view on both platforms, with a sensible bearing even at low speed.
 */
export function useChaseCamera(
  cameraRef: RefObject<CameraRef | null>,
  position: GeolocationPosition | null | undefined,
  enabled: boolean,
  padding: Padding
) {
  const lastFix = useRef<{
    lat: number;
    lng: number;
    timestamp: number;
  } | null>(null);
  const bearing = useRef(0);

  // Reset on (re)entering chase mode so a stale bearing from a previous
  // session doesn't swing the map on the first fix.
  useEffect(() => {
    if (enabled) lastFix.current = null;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !position) return;
    const { latitude: lat, longitude: lng, heading, speed } = position.coords;
    const here = { lat, lng };
    const prev = lastFix.current;

    if (heading !== null && (speed ?? 0) >= MIN_SPEED_FOR_HEADING_MPS) {
      bearing.current = heading;
    } else if (
      prev &&
      distanceMeters(prev, here) >= MIN_MOVE_FOR_DERIVED_BEARING_M
    ) {
      bearing.current = bearingDegrees(prev, here);
    }

    // Ease over roughly the interval between fixes so motion is continuous;
    // clamp so a long GPS gap doesn't produce a slow-motion crawl.
    const dt = prev
      ? Math.min(Math.max(position.timestamp - prev.timestamp, 300), 1500)
      : 800;
    lastFix.current = { lat, lng, timestamp: position.timestamp };

    cameraRef.current?.easeTo({
      center: [lng, lat],
      zoom: CHASE_ZOOM,
      pitch: CHASE_PITCH,
      bearing: bearing.current,
      padding,
      duration: dt,
      easing: 'linear'
    });
  }, [enabled, position, cameraRef, padding]);
}
