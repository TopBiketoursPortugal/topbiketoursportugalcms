import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { formatDistance } from '@/lib/geo';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from './Button';

export type RecomputeStatus = 'idle' | 'loading' | 'error';

type Props = {
  offRouteM: number;
  status: RecomputeStatus;
  errorMessage: string | null;
  onRecompute: () => void;
};

/**
 * Shown instead of WazeBanner when the rider has drifted off the planned
 * route and no detour has been computed yet — asks before doing anything,
 * rather than silently guessing. "Recompute" calls a live directions API
 * (src/lib/directions.ts), the one place this screen needs a network
 * connection; everything else on the Route tab works offline.
 */
export function OffRouteCard({ offRouteM, status, errorMessage, onRecompute }: Props) {
  const { colors, radii, spacing, fonts } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.danger, borderRadius: radii.lg }]}>
      <Text style={styles.arrow}>⚠️</Text>
      <Text style={[styles.title, { fontFamily: fonts.displaySemiBold }]}>You're off route</Text>
      <Text style={[styles.subtitle, { fontFamily: fonts.bodyMedium }]}>{formatDistance(offRouteM)} from the planned path</Text>

      {status === 'error' && errorMessage && (
        <Text style={[styles.error, { fontFamily: fonts.bodyRegular }]}>{errorMessage}</Text>
      )}

      <View style={{ marginTop: spacing.md, width: '100%' }}>
        {status === 'loading' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Button label={status === 'error' ? 'Try again' : 'Recompute route'} variant="secondary" onPress={onRecompute} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, alignItems: 'center' },
  arrow: { fontSize: 28 },
  title: { color: '#fff', fontSize: 18, marginTop: 4 },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  error: { color: 'rgba(255,255,255,0.95)', fontSize: 12, marginTop: 10, textAlign: 'center' },
});
