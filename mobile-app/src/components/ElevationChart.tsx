import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import type { ElevationData } from '@/lib/routeTrack';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  /** Illustrative 0..1 shape — used only when no real GPX elevation exists. */
  profile?: number[];
  /** Real per-step metres from the GPX pipeline; takes precedence over `profile`. */
  elevation?: ElevationData | null;
  height?: number;
};

/** Picks a "nice" metre step for the y-axis so labels land on round numbers. */
function niceStep(range: number): number {
  const raw = range / 3;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * pow;
}

/**
 * Filled climb profile. With real `elevation` it draws metres above sea
 * level against distance, with labelled axes; with only `profile` it falls
 * back to the unlabelled illustrative sparkline (see src/data/tours.ts).
 */
export function ElevationChart({ profile, elevation, height = 140 }: Props) {
  const { colors, fonts } = useTheme();
  const width = 100; // viewBox units; stretched to the container's width
  const padY = 8;
  const usableH = height - padY * 2;

  const real = !!elevation && elevation.samples.length > 1;

  let points: (readonly [number, number])[];
  let yTicks: { y: number; label: string }[] = [];
  let xTicks: { x: number; label: string }[] = [];

  if (real) {
    const { samples, minM, maxM, stepM } = elevation;
    // Floor/ceil the range to the tick step so the top/bottom gridlines are labelled.
    const step = niceStep(Math.max(maxM - minM, 20));
    const lo = Math.floor(minM / step) * step;
    const hi = Math.ceil(maxM / step) * step;
    const range = hi - lo || 1;
    points = samples.map((m, i) => [(i / (samples.length - 1)) * width, padY + (1 - (m - lo) / range) * usableH] as const);
    for (let m = lo; m <= hi; m += step) yTicks.push({ y: padY + (1 - (m - lo) / range) * usableH, label: `${m} m` });

    const totalKm = ((samples.length - 1) * stepM) / 1000;
    const kmStep = niceStep(totalKm);
    for (let km = 0; km <= totalKm; km += kmStep) xTicks.push({ x: (km / totalKm) * width, label: `${km}` });
  } else {
    const p = profile ?? [0, 0];
    points = p.map((v, i) => [(i / (p.length - 1)) * width, padY + (1 - v) * usableH] as const);
    yTicks = [0.25, 0.5, 0.75].map((f) => ({ y: padY + f * usableH, label: '' }));
  }

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {real && (
          <View style={[styles.yAxis, { height }]}>
            {yTicks.map((t) => (
              <Text
                key={t.label}
                style={[styles.tick, { top: t.y - 6, color: colors.muted, fontFamily: fonts.bodyMedium }]}
              >
                {t.label}
              </Text>
            ))}
          </View>
        )}
        <View style={{ flex: 1, height }}>
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.primary} stopOpacity={0.35} />
                <Stop offset="1" stopColor={colors.primary} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>
            {yTicks.map((t) => (
              <Line key={t.y} x1={0} x2={width} y1={t.y} y2={t.y} stroke={colors.borderSoft} strokeWidth={0.5} />
            ))}
            <Path d={fillPath} fill="url(#fill)" />
            <Path d={linePath} fill="none" stroke={colors.primary} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {last && <Circle cx={last[0]} cy={last[1]} r={2.6} fill={colors.accent} />}
          </Svg>
          {real && (
            <View style={styles.xAxis}>
              {xTicks.map((t) => (
                <Text
                  key={t.label}
                  style={[styles.tick, { left: `${t.x}%`, color: colors.muted, fontFamily: fonts.bodyMedium }]}
                >
                  {t.label}
                </Text>
              ))}
              <Text style={[styles.tick, styles.xUnit, { color: colors.muted, fontFamily: fonts.bodyMedium }]}>km</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: { flexDirection: 'row', gap: 6 },
  yAxis: { width: 44, position: 'relative' },
  xAxis: { height: 16, position: 'relative' },
  tick: { position: 'absolute', fontSize: 10 },
  xUnit: { right: 0 },
});
