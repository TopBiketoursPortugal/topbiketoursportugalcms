import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/lib/auth';
import { useMyTour } from '@/lib/useMyTour';
import { useTheme } from '@/theme/ThemeProvider';

export default function SupportScreen() {
  const { colors, radii, spacing, fonts } = useTheme();
  const mine = useMyTour();
  const { signOut } = useAuth();
  if (!mine) return null;
  const { booking } = mine;

  return (
    <Screen>
      <ScreenHeader eyebrow="Support" title="We're one tap away" />

      <View style={[styles.sos, { backgroundColor: colors.danger, borderRadius: radii.xl }]}>
        <Text style={styles.sosTitle}>SOS</Text>
        <Text style={styles.sosBody}>Shares your live location with your guide and our office instantly.</Text>
        <Button
          label="Send SOS"
          variant="secondary"
          onPress={() => {}}
          style={{ backgroundColor: '#fff', marginTop: spacing.md }}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted, fontFamily: fonts.bodyBold }]}>YOUR GUIDE</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        <Text style={{ color: colors.ink, fontFamily: fonts.displayMedium, fontSize: 17 }}>{booking.guide.name}</Text>
        <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium, marginTop: 2 }}>{booking.guide.phone}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
          <Button
            label="Call"
            variant="secondary"
            onPress={() => Linking.openURL(`tel:${booking.guide.phone}`)}
            style={{ flex: 1 }}
          />
          <Button
            label="WhatsApp"
            variant="ghost"
            onPress={() => Linking.openURL(`https://wa.me/${booking.guide.phone.replace(/\D/g, '')}`)}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted, fontFamily: fonts.bodyBold, marginTop: spacing.xl }]}>
        ACCOUNT
      </Text>
      <Button label="Sign out" variant="ghost" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sos: { padding: 20, marginBottom: 24 },
  sosTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  sosBody: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 6, lineHeight: 18 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, marginBottom: 10 },
  card: { borderWidth: 1, padding: 16 },
});
