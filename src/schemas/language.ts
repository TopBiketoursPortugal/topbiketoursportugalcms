import { unionOfLiterals } from 'utils/unionOfLiterals';

/**
 * Every language the site is published in. `en` is the default (unprefixed)
 * locale; each other code is a URL prefix (`/pt/`, `/de/`, …) and a content
 * subfolder (`src/content/<collection>/<code>/`).
 *
 * Keep in sync with data/languages.json — that file carries the display data
 * (name, hreflang locale, flag) and is what tools/seo and astro.config read;
 * this array exists so the schemas get a literal union type.
 */
export const languageCodes = ['en', 'pt', 'de', 'es', 'fr', 'nl'] as const;

export type LanguageCodes = (typeof languageCodes)[number];

export const languageSchema = unionOfLiterals(languageCodes);
