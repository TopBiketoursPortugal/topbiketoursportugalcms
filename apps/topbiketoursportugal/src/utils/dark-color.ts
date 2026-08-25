// Maps CMS light-mode hex values to their dark-mode equivalents
// Based on data/colors.json color definitions

const BG_MAP: Record<string, string> = {
  '#ffffff': '#0f172a', // white -> slate-900
  '#000000': '#ffffff', // black -> white
  '#f2f2f2': '#030712', // light gray -> gray-950
  '#333333': '#e5e7eb', // dark gray -> gray-200
  '#faf3dd': '#451a03', // eggshell -> amber-950
  '#f2e2d2': '#7c2d12', // almond -> orange-900
  '#fef9ef': '#431407', // floral white -> orange-950
  '#c8d5b9': '#166534', // tea green -> green-800
  '#9abca7': '#047857', // cambridge blue -> emerald-700
  '#f7b2ad': '#991b1b', // melon -> red-800
  '#faf9f6': '#1c1917', // secondary light font -> stone-950
  '#edeade': '#292524', // tertiary light font -> stone-900
  '#fffff0': '#422006', // primary light font -> yellow-950
  '#808080': '#6b7280' // gray -> gray-500 (stays similar)
};

const TEXT_MAP: Record<string, string> = {
  '#000000': '#f8fafc', // black text -> slate-50
  '#393939': '#d1d5db', // primary font -> gray-300
  '#475569': '#94a3b8', // secondary font -> slate-400
  '#333333': '#e5e7eb', // dark gray text -> gray-200
  '#333232': '#e5e7eb', // jet -> gray-200
  '#ffffff': '#0f172a', // white text -> slate-900
  '#808080': '#9ca3af' // gray -> gray-400
};

export function getDarkEquivalent(lightHex: string | undefined | null): string {
  if (!lightHex) return '#1e293b';
  const normalized = lightHex.trim().toLowerCase();
  return BG_MAP[normalized] ?? '#1e293b';
}

export function getDarkTextEquivalent(
  lightHex: string | undefined | null
): string {
  if (!lightHex) return '#f1f5f9';
  const normalized = lightHex.trim().toLowerCase();
  return TEXT_MAP[normalized] ?? '#f1f5f9';
}
