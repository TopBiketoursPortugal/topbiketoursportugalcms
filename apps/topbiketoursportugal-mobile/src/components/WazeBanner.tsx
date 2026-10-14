import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatDistance } from '@/lib/geo';
import type { Maneuver } from '@/lib/routeTrack';
import { useTheme } from '@/theme/ThemeProvider';

const ARROW: Record<Maneuver['turn'], string> = {
  left: '⬅️',
  right: '➡️',
  'slight-left': '↖️',
  'slight-right': '↗️',
  'u-turn': '↩️',
  straight: '⬆️',
};

type Props = {
  maneuver: Maneuver | null;
  distanceToManeuverM: number | null;
  totalDistanceM: number;
  progressDistanceM: number;
  /** true while following a live-recomputed detour rather than the planned route. */
  detour?: boolean;
};

/**
 * Street-level "in 300m, turn left" banner. Purely a display of whichever
 * track is currently active for navigation (the planned offline route, or
 * a live-recomputed detour) — see OffRouteCard for what happens when the
 * rider isn't on either yet.
 */
export function WazeBanner({ maneuver, distanceToManeuverM, totalDistanceM, progressDistanceM, detour }: Props) {
  const { colors, radii, fonts } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: detour ? colors.secondary : colors.primary, borderRadius: radii.lg }]}>
      {detour && <Text style={[styles.detourLabel, { fontFamily: fonts.bodyBold }]}>NEW ROUTE</Text>}
      {maneuver ? (
        <>
          <Text style={styles.arrow}>{ARROW[maneuver.turn]}</Text>
          <Text style={[styles.instruction, { fontFamily: fonts.displaySemiBold }]}>{maneuver.instruction}</Text>
          {distanceToManeuverM !== null && (
            <Text style={[styles.distance, { fontFamily: fonts.bodyMedium }]}>in {formatDistance(distanceToManeuverM)}</Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.arrow}>🏁</Text>
          <Text style={[styles.instruction, { fontFamily: fonts.displaySemiBold }]}>Straight on to the finish</Text>
        </>
      )}
      <Text style={[styles.progress, { fontFamily: fonts.bodyRegular }]}>
        {formatDistance(progressDistanceM)} of {formatDistance(totalDistanceM)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 18, alignItems: 'center' },
  detourLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 1.2, marginBottom: 6 },
  arrow: { fontSize: 32 },
  instruction: { color: '#fff', fontSize: 20, marginTop: 4 },
  distance: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 2 },
  progress: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 8 },
});
