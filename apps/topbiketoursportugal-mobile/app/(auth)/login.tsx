import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { requestOtp } from '@/lib/auth';
import { useTheme } from '@/theme/ThemeProvider';

export default function LoginScreen() {
  const { colors, spacing, radii, fonts } = useTheme();
  const router = useRouter();

  const [phone, setPhone] = useState('+351 ');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setError(null);
    setLoading(true);
    const result = await requestOtp(phone);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push({ pathname: '/(auth)/verify', params: { phone } });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
        <View style={[styles.hero, { backgroundColor: colors.primary, borderRadius: radii.xl }]}>
          <BrandMark size={44} color="#FFFFFF" />
          <Text style={[styles.brand, { fontFamily: fonts.displayBold }]}>Rota</Text>
          <Text style={styles.tagline}>by Top Bike Tours Portugal</Text>
        </View>

        <View style={[styles.body, { paddingHorizontal: spacing.xl }]}>
          <Text style={[styles.title, { color: colors.ink, fontFamily: fonts.displayBold }]}>
            Your trip, unlocked by your booking
          </Text>
          <Text style={[styles.lede, { color: colors.muted, fontFamily: fonts.bodyRegular }]}>
            Enter the phone number you used when you booked. We'll text you a one-time code — no account, no
            password.
          </Text>

          <Text style={[styles.label, { color: colors.muted, fontFamily: fonts.bodySemiBold }]}>Phone number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            placeholder="+351 912 345 678"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                borderColor: error ? colors.danger : colors.border,
                color: colors.ink,
                backgroundColor: colors.surface,
                borderRadius: radii.md,
                fontFamily: fonts.bodyMedium,
              },
            ]}
          />
          {error && <Text style={[styles.error, { color: colors.danger, fontFamily: fonts.bodyMedium }]}>{error}</Text>}

          <Button label="Send code" onPress={handleSend} loading={loading} style={{ marginTop: spacing.lg }} />

          <Text style={[styles.hint, { color: colors.muted, fontFamily: fonts.bodyRegular }]}>
            Demo booking: +351 912 345 678 · code 123456
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { margin: 20, marginBottom: 8, paddingVertical: 40, alignItems: 'center', gap: 6 },
  brand: { color: '#fff', fontSize: 30, marginTop: 8 },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  body: { flex: 1, paddingTop: 28 },
  title: { fontSize: 24, lineHeight: 30 },
  lede: { fontSize: 15, lineHeight: 22, marginTop: 10 },
  label: { fontSize: 12, letterSpacing: 0.4, marginTop: 28, marginBottom: 8, textTransform: 'uppercase' },
  input: { borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  error: { fontSize: 13, marginTop: 8 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 18 },
});
