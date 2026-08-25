import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatDistance } from '@/lib/geo';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  /** m/s from the OS, null when unknown. */
  speedMps: number | null;
  /** Metres above sea level, null when unknown. */
  elevationM: number | null;
  nextWaypointLabel: string;
  distanceToWaypointM: number | null;
};

/**
 * Bottom HUD for navigation mode — the three numbers a rider glances at
 * between turns: how fast, how high, how far to the next stop. Sits above
 * the "open in Waze / Google Maps" bar.
 */
export function NavHud({ speedMps, elevationM, nextWaypointLabel, distanceToWaypointM }: Props) {
  const { colors, radii, fonts } = useTheme();
  // Treat sub-walking speeds as stopped — GPS drift reports 0.3 m/s at a standstill.
  const kmh = speedMps !== null && speedMps >= 0.5 ? Math.round(speedMps * 3.6) : 0;

  return (
    <View style={[styles.hud, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
      <Stat value={speedMps === null ? '—' : `${kmh}`} unit="km/h" label="Speed" />
      <Divider color={colors.border} />
      <Stat value={elevationM === null ? '—' : `${Math.round(elevationM)}`} unit="m" label="Elevation" />
      <Divider color={colors.border} />
      <Stat
        value={distanceToWaypointM === null ? '—' : formatDistance(distanceToWaypointM)}
        label={nextWaypointLabel}
        wide
      />
    </View>
  );
}

function Stat({ value, unit, label, wide }: { value: string; unit?: string; label: string; wide?: boolean }) {
  const { colors, fonts } = useTheme();
  return (
    <View style={[styles.stat, wide && { flex: 1.4 }]}>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.ink, fontFamily: fonts.displaySemiBold }]} numberOfLines={1}>
          {value}
        </Text>
        {unit && <Text style={[styles.unit, { color: colors.muted, fontFamily: fonts.bodyMedium }]}>{unit}</Text>}
      </View>
      <Text style={[styles.label, { color: colors.muted, fontFamily: fonts.bodyMedium }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  stat: { flex: 1, alignItems: 'center' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value: { fontSize: 22 },
  unit: { fontSize: 11 },
  label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 1, maxWidth: 120 },
  divider: { width: StyleSheet.hairlineWidth, height: 30 },
});
