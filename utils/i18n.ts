import i18n from 'src/../data/i18n.json';

export function t(
  key: keyof typeof i18n.en,
  language: keyof typeof i18n = 'en'
): string {
  return i18n[language][key];
}
