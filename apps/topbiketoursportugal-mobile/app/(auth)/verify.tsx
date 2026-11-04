import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { OtpInput } from '@/components/OtpInput';
import { requestOtp, useAuth, verifyOtp } from '@/lib/auth';
import { useTheme } from '@/theme/ThemeProvider';

const RESEND_SECONDS = 60;

export default function VerifyScreen() {
  const { colors, spacing, fonts } = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function handleVerify(value: string) {
    setError(null);
    setLoading(true);
    const result = await verifyOtp(phone ?? '', value);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await signIn(result.booking);
    // Stack.Protected reacts to the session change and swaps to the (app) group.
  }

  async function handleResend() {
    setCooldown(RESEND_SECONDS);
    setCode('');
    setError(null);
    await requestOtp(phone ?? '');
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={[styles.body, { paddingHorizontal: spacing.xl }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={{ color: colors.muted, fontFamily: fonts.bodyMedium }}>← Back</Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.ink, fontFamily: fonts.displayBold }]}>Verify it's you</Text>
        <Text style={[styles.lede, { color: colors.muted, fontFamily: fonts.bodyRegular }]}>
          Enter the 6-digit code sent to{' '}
          <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold }}>{phone}</Text>
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <OtpInput
            value={code}
            autoFocus
            onChange={(v) => {
              setCode(v);
              setError(null);
              if (v.length === 6) handleVerify(v);
            }}
          />
        </View>

        {error && <Text style={[styles.error, { color: colors.danger, fontFamily: fonts.bodyMedium }]}>{error}</Text>}

        <Button
          label="Unlock my trip"
          onPress={() => handleVerify(code)}
          loading={loading}
          disabled={code.length < 6}
          style={{ marginTop: spacing.xl }}
        />

        <Pressable onPress={handleResend} disabled={cooldown > 0} style={{ marginTop: spacing.lg }}>
          <Text style={{ color: cooldown > 0 ? colors.muted : colors.primary, fontFamily: fonts.bodyMedium, textAlign: 'center' }}>
            {cooldown > 0 ? `Resend code in 0:${cooldown.toString().padStart(2, '0')}` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, paddingTop: 24 },
  title: { fontSize: 24, marginTop: 24 },
  lede: { fontSize: 15, lineHeight: 22, marginTop: 10 },
  error: { fontSize: 13, marginTop: 16 },
});
