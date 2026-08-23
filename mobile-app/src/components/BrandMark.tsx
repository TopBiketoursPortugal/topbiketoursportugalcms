import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** The arched line from the marketing site's favicon — reused as the app's loading / brand mark. */
export function BrandMark({ size = 40, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <Path
        d="M8 55 C20 15 35 8 50 8 C65 8 80 15 92 55"
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
