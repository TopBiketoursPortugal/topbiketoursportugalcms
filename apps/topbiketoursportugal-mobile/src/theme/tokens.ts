/**
 * Color tokens ported 1:1 from the marketing site's brand system
 * (data/colors.json + src/styles/global.css `--color-*` custom properties),
 * with a dark variant that keeps the same hue relationships instead of a
 * naive invert.
 */
export const lightColors = {
  bg: '#FEF9EF',
  bgAlt: '#FAF3DD',
  surface: '#FFFFFF',
  ink: '#18271F',
  text: '#2B3A32',
  muted: '#5D6B62',
  primary: '#296A3F',
  primarySoft: '#EAF3ED',
  secondary: '#C2410C',
  accent: '#FF7700',
  info: '#0E7490',
  border: '#DDE3D7',
  borderSoft: '#E9ECDF',
  danger: '#B3261E'
} as const;

export const darkColors: Record<keyof typeof lightColors, string> = {
  bg: '#0E1712',
  bgAlt: '#142019',
  surface: '#16211A',
  ink: '#EEF5EE',
  text: '#CDDCCF',
  muted: '#8EA691',
  primary: '#6FCF97',
  primarySoft: '#1C3227',
  secondary: '#FF9457',
  accent: '#FFB066',
  info: '#67D6E8',
  border: '#253327',
  borderSoft: '#1E2B22',
  danger: '#FF6B60'
};

export type ThemeColors = Record<keyof typeof lightColors, string>;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999
} as const;

/** Registered names — must match the keys used in useFonts() in app/_layout.tsx. */
export const fonts = {
  displayRegular: 'BricolageGrotesque_400Regular',
  displayMedium: 'BricolageGrotesque_500Medium',
  displaySemiBold: 'BricolageGrotesque_600SemiBold',
  displayBold: 'BricolageGrotesque_700Bold',
  bodyRegular: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemiBold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
  hand: 'Caveat_600SemiBold'
} as const;
