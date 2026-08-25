import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

const LENGTH = 6;

type Props = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

/** Six boxes that behave like one field — backed by a single hidden TextInput. */
export function OtpInput({ value, onChange, autoFocus }: Props) {
  const { colors, radii, fonts } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(LENGTH, ' ').split('');

  return (
    <View>
      <View style={styles.row}>
        {digits.map((digit, i) => {
          const filled = digit !== ' ';
          const active = value.length === i;
          return (
            <View
              key={i}
              style={[
                styles.box,
                {
                  borderRadius: radii.sm,
                  borderColor: filled || active ? colors.primary : colors.border,
                  backgroundColor: colors.bgAlt,
                },
              ]}
              onTouchEnd={() => inputRef.current?.focus()}
            >
              <TextInput
                editable={false}
                value={filled ? digit : ''}
                style={[styles.digit, { color: colors.ink, fontFamily: fonts.displayBold }]}
                pointerEvents="none"
              />
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        maxLength={LENGTH}
        style={styles.hidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  box: {
    width: 44,
    height: 54,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { fontSize: 20, textAlign: 'center', width: '100%' },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});
