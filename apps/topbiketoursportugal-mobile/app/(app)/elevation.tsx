import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ElevationChart } from '@/components/ElevationChart';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getTrack } from '@/data/tracks';
import { useMyTour } from '@/lib/useMyTour';
import { useTheme } from '@/theme/ThemeProvider';

export default function ElevationScreen() {
  const { colors, radii, fonts } = useTheme();
  const mine = useMyTour();
  if (!mine) return null;
  const { tour } = mine;

  // Real elevation comes from the same precomputed GPX track the Route tab
  // navigates on (scripts/gpx-to-track.mjs). No GPX → illustrative shape.
  const track = getTrack(tour.id);
  const elevation = track?.elevation ?? null;

  return (
    <Screen>
      <ScreenHeader eyebrow="Elevation" title="Climb profile" />

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {elevation && track ? (
          <>
            <View style={styles.statRow}>
              <Stat label="Distance" value={`${(track.totalDistanceM / 1000).toFixed(0)} km`} />
              <Stat label="Ascent" value={`↗ ${elevation.ascentM.toLocaleString()} m`} />
              <Stat label="Descent" value={`↘ ${elevation.descentM.toLocaleString()} m`} />
            </View>
            <View style={styles.statRow}>
              <Stat label="Lowest" value={`${elevation.minM} m`} />
              <Stat label="Highest" value={`${elevation.maxM} m`} />
              <Stat label="Days" value={tour.days} />
            </View>
          </>
        ) : (
          <View style={styles.statRow}>
            <Stat label="Distance" value={`${tour.distanceKm} km`} />
            <Stat label="Ascent" value={tour.ascent} />
            <Stat label="Days" value={tour.days} />
          </View>
        )}
        <ElevationChart profile={tour.elevationProfile} elevation={elevation} />
      </View>

      <View style={[styles.note, { backgroundColor: colors.primarySoft, borderRadius: radii.md }]}>
        {elevation ? (
          <Text style={{ color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 19 }}>
            Real profile from the ridden GPX, sampled every {elevation.stepM} m. Ascent and descent are computed
            from a smoothed track so GPS altitude noise isn't counted as climbing — expect them to differ a
            little from a bike computer's figure.
          </Text>
        ) : (
          <Text style={{ color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 19 }}>
            This profile shape is illustrative — no ridden GPX has been imported for this tour yet. Drop one
            into <Text style={{ fontFamily: fonts.bodyBold }}>assets/gpx/{tour.id}.gpx</Text> and run{' '}
            <Text style={{ fontFamily: fonts.bodyBold }}>node scripts/gpx-to-track.mjs</Text> to replace it
            with real elevation.
          </Text>
        )}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors, fonts } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.ink, fontFamily: fonts.displaySemiBold, fontSize: 16 }} numberOfLines={1}>
        {value}
      </Text>
      <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 11, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 16, marginBottom: 16 },
  statRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  note: { padding: 14 },
});
