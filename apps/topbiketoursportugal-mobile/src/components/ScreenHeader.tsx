import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

export function ScreenHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { colors, fonts, spacing } = useTheme();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[styles.eyebrow, { color: colors.secondary, fontFamily: fonts.bodyBold }]}>
        {eyebrow.toUpperCase()}
      </Text>
      <Text style={[styles.title, { color: colors.ink, fontFamily: fonts.displayBold }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, letterSpacing: 1.2, marginBottom: 6 },
  title: { fontSize: 26 },
});
