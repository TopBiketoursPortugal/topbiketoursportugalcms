import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ClimbLevel } from '@/data/tours';

export function ClimbBadge({ level, label }: { level: ClimbLevel; label: string }) {
  const { colors, radii, fonts, scheme } = useTheme();

  const tone: Record<ClimbLevel, { bg: string; fg: string }> = {
    easy: { bg: colors.primarySoft, fg: colors.primary },
    moderate: { bg: `${colors.secondary}22`, fg: colors.secondary },
    epic: { bg: `${colors.accent}30`, fg: scheme === 'dark' ? colors.accent : '#7A3C00' },
  };

  const { bg, fg } = tone[level];

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderRadius: radii.pill }]}>
      <Text style={{ color: fg, fontFamily: fonts.bodyBold, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4 },
});
