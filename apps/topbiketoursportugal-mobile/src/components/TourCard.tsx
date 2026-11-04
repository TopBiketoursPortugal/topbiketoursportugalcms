import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClimbBadge } from '@/components/Badge';
import { useTheme } from '@/theme/ThemeProvider';
import type { Tour } from '@/data/tours';

export function TourCard({ tour, onPress }: { tour: Tour; onPress?: () => void }) {
  const { colors, radii, spacing, fonts } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.region, { color: colors.primary, fontFamily: fonts.bodyBold }]}>
            {tour.region.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: colors.ink, fontFamily: fonts.displaySemiBold }]}>{tour.name}</Text>
        </View>
        <ClimbBadge level={tour.climbLevel} label={tour.climbLabel} />
      </View>

      <View style={[styles.statRow, { backgroundColor: colors.bgAlt, borderRadius: radii.md }]}>
        <Stat value={tour.distanceKm} label="km" colors={colors} fonts={fonts} />
        <Stat value={tour.days} label="days" colors={colors} fonts={fonts} />
        <Stat value={tour.ascent} label="" colors={colors} fonts={fonts} small />
      </View>
    </Pressable>
  );
}

function Stat({
  value,
  label,
  colors,
  fonts,
  small,
}: {
  value: string;
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
  fonts: ReturnType<typeof useTheme>['fonts'];
  small?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text
        numberOfLines={1}
        style={{
          color: colors.ink,
          fontFamily: fonts.displaySemiBold,
          fontSize: small ? 13 : 17,
        }}
      >
        {value}
      </Text>
      {!!label && <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 11 }}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  head: { flexDirection: 'row', gap: 10, padding: 16, alignItems: 'flex-start' },
  region: { fontSize: 11, letterSpacing: 0.4, marginBottom: 4 },
  name: { fontSize: 17, lineHeight: 22 },
  statRow: { flexDirection: 'row', margin: 12, marginTop: 0, padding: 12 },
  stat: { flex: 1 },
});
