import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { distanceMeters, formatDistance, type LatLng, nextWaypointIndex } from '@/lib/geo';
import { useTheme } from '@/theme/ThemeProvider';
import type { Waypoint } from '@/data/tours';

type Props = {
  waypoints: Waypoint[];
  position: LatLng | null;
};

/**
 * Stop-to-stop cue sheet — "next stop, and how far" — rather than
 * street-level turn instructions. That's the right shape for a multi-day
 * tour with a fixed, pre-planned route (it's what Backroads' route notes
 * and RideWithGPS's voice-assist both do). It picks the nearest waypoint
 * as "next" by straight-line distance; a real build should project the
 * live position onto the actual GPX track and use along-route distance
 * instead, which handles the rider briefly moving away from a stop.
 */
export function TurnByTurnCue({ waypoints, position }: Props) {
  const { colors, radii, spacing, fonts } = useTheme();

  // "Next" is one stop ahead of whichever waypoint we're nearest to.
  const nextIndex = useMemo(() => nextWaypointIndex(waypoints, position), [position, waypoints]);

  const next = waypoints[nextIndex];
  const distanceToNext = position ? distanceMeters(position, next) : null;

  return (
    <View>
      <View style={[styles.banner, { backgroundColor: colors.primary, borderRadius: radii.lg }]}>
        <Text style={styles.bannerLabel}>NEXT STOP</Text>
        <Text style={[styles.bannerName, { fontFamily: fonts.displaySemiBold }]}>{next.label}</Text>
        <Text style={[styles.bannerDistance, { fontFamily: fonts.bodyMedium }]}>
          {distanceToNext !== null ? `${formatDistance(distanceToNext)} away` : 'Waiting for GPS…'}
        </Text>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        {waypoints.map((wp, i) => {
          const done = i < nextIndex;
          const active = i === nextIndex;
          return (
            <View key={`${wp.label}-${i}`} style={styles.row}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: done ? colors.primary : active ? colors.accent : colors.border,
                      borderColor: colors.bg,
                    },
                  ]}
                />
                {i < waypoints.length - 1 && (
                  <View style={[styles.line, { backgroundColor: done ? colors.primary : colors.border }]} />
                )}
              </View>
              <Text
                style={{
                  color: active ? colors.ink : done ? colors.muted : colors.text,
                  fontFamily: active ? fonts.bodyBold : fonts.bodyMedium,
                  fontSize: 14,
                  paddingBottom: spacing.lg,
                }}
              >
                {wp.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 18, alignItems: 'center' },
  bannerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 1.2 },
  bannerName: { color: '#fff', fontSize: 20, marginTop: 4 },
  bannerDistance: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  rail: { width: 12, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  line: { width: 2, flex: 1, marginTop: 2, minHeight: 18 },
});
