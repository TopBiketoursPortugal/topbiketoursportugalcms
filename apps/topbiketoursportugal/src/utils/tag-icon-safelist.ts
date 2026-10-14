/**
 * Safelist of all tour tag icon classes.
 * Tailwind scans this file to detect dynamically-used Iconify classes.
 */
export const tagIconClasses = [
  'icon-[ph--wine-light]',
  'icon-[ph--fork-knife-light]',
  'icon-[ph--bank-light]',
  'icon-[ph--waves-light]',
  'icon-[ph--church-light]',
  'icon-[ph--tree-light]',
  'icon-[ph--buildings-light]',
  'icon-[ph--mountains-light]',
  'icon-[ph--users-light]',
  'icon-[ph--baby-light]',
  'icon-[ph--person-simple-bike-light]',
  'icon-[ph--trophy-light]',
  'icon-[ph--bicycle-light]',
  'icon-[ph--lightning-light]',
  'icon-[ph--road-horizon-light]',
  'icon-[ph--path-light]',
  'icon-[ph--map-pin-light]',
  'icon-[ph--ranking-light]',
  'icon-[ph--arrow-right-light]'
] as const;

export function getTagIconClass(icon: string | null | undefined): string {
  if (!icon) return 'icon-[ph--tag-light]';
  return `icon-[${icon}]`;
}
