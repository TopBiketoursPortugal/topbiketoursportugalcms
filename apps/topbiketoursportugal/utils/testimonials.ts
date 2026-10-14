import { getCollection, type CollectionEntry } from 'astro:content';
import type { LanguageCodes } from 'src/schemas/language';

const DEFAULT_LANGUAGE: LanguageCodes = 'en';

/**
 * Testimonials for `language`, falling back to the default locale.
 *
 * Testimonials are verbatim guest reviews — Mary from Seattle wrote hers in
 * English and it stays in English, the way every review widget shows them.
 * So unlike every other collection they are NOT cloned per language
 * (tools/mdx-clone.mjs skips them): one set of 168 entries serves the whole
 * site rather than 168 × 6 copies of the same untranslatable quotes.
 *
 * That leaves the language filter these components used with nothing to match
 * outside `en` — every locale but the default rendered an empty carousel,
 * which is what `/pt/` did before the extra locales existed. Falling back to
 * the default locale's entries is what makes the section appear at all on a
 * translated page; the surrounding copy is translated, the quotes are not.
 *
 * A locale that *does* have its own testimonials (someone adds
 * `src/content/testimonials/pt/…`) keeps them and never sees the fallback.
 */
export async function getTestimonialsFor(
  language: LanguageCodes,
  filter: (entry: CollectionEntry<'testimonials'>) => boolean = () => true
) {
  const localised = await getCollection(
    'testimonials',
    (entry) => entry.data.language === language && filter(entry)
  );

  if (localised.length || language === DEFAULT_LANGUAGE) return localised;

  return getCollection(
    'testimonials',
    (entry) => entry.data.language === DEFAULT_LANGUAGE && filter(entry)
  );
}
