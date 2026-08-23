import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useMyTour } from '@/lib/useMyTour';
import { useTheme } from '@/theme/ThemeProvider';

export default function SightseeingScreen() {
  const { colors, radii, spacing, fonts } = useTheme();
  const mine = useMyTour();
  if (!mine) return null;
  const { tour } = mine;

  return (
    <Screen>
      <ScreenHeader eyebrow="Sightseeing" title="Stops along the way" />

      {tour.highlights.map((highlight, i) => {
        const pinned = tour.highlightPins?.some((p) => p.label === highlight);
        return (
          <View
            key={highlight}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}
          >
            <View style={[styles.index, { backgroundColor: colors.primarySoft, borderRadius: radii.pill }]}>
              <Text style={{ color: colors.primary, fontFamily: fonts.displaySemiBold, fontSize: 13 }}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 15 }}>{highlight}</Text>
              <Text style={{ color: colors.muted, fontFamily: fonts.bodyRegular, fontSize: 13, marginTop: 3 }}>
                {pinned
                  ? '📍 Shown on the Route tab map.'
                  : 'A regional highlight, not a single spot — no map pin yet.'}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={[styles.card, { backgroundColor: colors.bgAlt, borderColor: colors.border, borderRadius: radii.lg }]}>
        <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 19 }}>
          Highlights marked 📍 above are real, geo-tagged landmarks (see `highlightPins` in
          src/data/tours.ts) shown as pins on the Route tab map. Regional/thematic highlights
          intentionally have no pin rather than a guessed one — before this ships, each should still
          link out to a real POI card with opening hours and a short story.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, borderWidth: 1, padding: 14, marginBottom: 12, alignItems: 'flex-start' },
  index: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
});
