/**
 * "Is this package row a yes/no tick, or a real value?"
 *
 * A tour package lists what it includes as `{ title, description }` rows. Most
 * descriptions are prose ("4 stars, farms or rural houses"), but a large share
 * are just an affirmative or a negative, and those render as a check or cross
 * icon instead of the word — the pricing table reads as a comparison grid that
 * way.
 *
 * The check used to be `description === 'Yes' || description === 'No'`, which
 * quietly assumed the content was English. Once the tours were translated, the
 * German rows said `Ja` and the Spanish ones `Sí`, so every one of them fell
 * through to the prose branch and printed the bare word where the English page
 * shows an icon — 486 rows in German, 380 in Spanish, and 21 that Portuguese
 * had been getting wrong since before the other locales existed.
 *
 * Matching the affirmative in every published language is what keeps the icon,
 * and lets the source data stay in the language of the page it belongs to.
 * Comparison is case- and accent-insensitive so `Si`, `sí` and `SÍ` all count;
 * anything else is still prose and is printed verbatim.
 */

const AFFIRMATIVE = new Set(['yes', 'sim', 'ja', 'si', 'oui']);
/*
 * The negatives also cover the marks editors actually type for "not included":
 * a bare `X`, a cross glyph, or a dash. Those fell through to the prose branch
 * and printed a literal letter X next to the green check circles — an
 * inconsistency the reader has to decode rather than scan. They are
 * language-independent, so they sit alongside the translated words.
 */
const NEGATIVE = new Set([
  'no',
  'nao',
  'nein',
  'nee',
  'non',
  'x',
  '✗',
  '✘',
  '×',
  '-',
  '–',
  '—',
  'n/a',
  'na'
]);

/** Lowercased, stripped of accents and surrounding space. */
function normalise(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function isAffirmative(description?: string | null): boolean {
  return description ? AFFIRMATIVE.has(normalise(description)) : false;
}

export function isNegative(description?: string | null): boolean {
  return description ? NEGATIVE.has(normalise(description)) : false;
}

/** True when the row is a plain yes/no and should render as an icon. */
export function isInclusionFlag(description?: string | null): boolean {
  return isAffirmative(description) || isNegative(description);
}
