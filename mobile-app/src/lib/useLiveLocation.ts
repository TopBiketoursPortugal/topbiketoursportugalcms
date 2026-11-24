import {
  LocationManager,
  useCurrentPosition
} from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';

export type PermissionState = 'unknown' | 'granted' | 'denied';

/**
 * Live GPS position for the Route tab, backed by MapLibre's own
 * LocationManager (it requests ACCESS_FINE_LOCATION / requestWhenInUse
 * itself — no separate expo-location permission flow needed).
 */
export function useLiveLocation(enabled: boolean) {
  const [permission, setPermission] = useState<PermissionState>('unknown');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    LocationManager.requestPermissions().then((granted) => {
      if (!cancelled) setPermission(granted ? 'granted' : 'denied');
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // 2m: fine enough that the chase camera (useChaseCamera) glides smoothly
  // at cycling speed rather than stepping every few seconds.
  const position = useCurrentPosition({
    enabled: enabled && permission === 'granted',
    minDisplacement: 2
  });

  return { position, permission };
}
