import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClimbBadge } from '@/components/Badge';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { daysUntil, useMyTour } from '@/lib/useMyTour';
import { useTheme } from '@/theme/ThemeProvider';

const FEATURES = [
  {
    href: '/route',
    icon: '🧭',
    title: 'Turn-by-turn navigation',
    body: 'Voice directions and visual cues for your route.',
  },
  {
    href: '/route',
    icon: '📶',
    title: 'Works offline',
    body: 'Download the map once — navigation keeps going with zero signal.',
  },
  {
    href: '/elevation',
    icon: '📈',
    title: 'Know the climbs',
    body: 'Real elevation profile from the ridden route.',
  },
  {
    href: '/sightseeing',
    icon: '📍',
    title: 'Sights along the way',
    body: 'Highlights pinned right on the map.',
  },
] as const;

export default function MyTripScreen() {
  const { colors, radii, spacing, fonts } = useTheme();
  const mine = useMyTour();

  if (!mine) return null; // Stack.Protected guarantees a session here; this satisfies TS.
  const { booking, tour } = mine;
  const inDays = daysUntil(booking.startDate);

  return (
    <Screen>
      <ScreenHeader eyebrow="My Trip" title={`Hey ${booking.riderName.split(' ')[0]}`} />

      <View style={[styles.countdown, { backgroundColor: colors.primary, borderRadius: radii.xl }]}>
        <Text style={styles.countdownNumber}>{inDays > 0 ? inDays : 0}</Text>
        <Text style={styles.countdownLabel}>{inDays > 0 ? 'days until your trip' : 'your trip has started'}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        <View style={styles.cardHead}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.region, { color: colors.primary, fontFamily: fonts.bodyBold }]}>
              {tour.region.toUpperCase()}
            </Text>
            <Text style={[styles.tourName, { color: colors.ink, fontFamily: fonts.displaySemiBold }]}>{tour.name}</Text>
          </View>
          <ClimbBadge level={tour.climbLevel} label={tour.climbLabel} />
        </View>
        <Text style={[styles.meta, { color: colors.muted, fontFamily: fonts.bodyMedium }]}>
          {tour.distanceKm} km · {tour.days} days · Booking {booking.bookingRef}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted, fontFamily: fonts.bodyBold }]}>YOUR GUIDE</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        <Text style={[styles.guideName, { color: colors.ink, fontFamily: fonts.displayMedium }]}>{booking.guide.name}</Text>
        <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium, marginTop: 2 }}>{booking.guide.phone}</Text>
        <Text style={{ color: colors.muted, fontFamily: fonts.bodyRegular, fontSize: 13, marginTop: spacing.sm }}>
          Reachable from the Support tab any time during your trip.
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted, fontFamily: fonts.bodyBold }]}>WHAT'S IN THE APP</Text>
      {FEATURES.map((f) => (
        <Link key={f.title} href={f.href} asChild>
          <Pressable
            style={({ pressed }) => [
              styles.feature,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 15 }}>{f.title}</Text>
              <Text style={{ color: colors.muted, fontFamily: fonts.bodyRegular, fontSize: 13, marginTop: 2 }}>{f.body}</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  countdown: { padding: 24, alignItems: 'center', marginBottom: 20 },
  countdownNumber: { color: '#fff', fontSize: 44, fontWeight: '700' },
  countdownLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  card: { borderWidth: 1, padding: 16, marginBottom: 20 },
  cardHead: { flexDirection: 'row', gap: 10 },
  region: { fontSize: 11, letterSpacing: 0.4, marginBottom: 4 },
  tourName: { fontSize: 18, lineHeight: 23 },
  meta: { fontSize: 13, marginTop: 10 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, marginBottom: 10 },
  guideName: { fontSize: 17 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, padding: 14, marginBottom: 10 },
  featureIcon: { fontSize: 22 },
});
