import type { z } from 'astro/zod';
import { unionOfLiterals } from './union-of-literals';

/**
 * A zod literal-union over an app's locale codes.
 *
 * Each app owns its locale list (it must match that app's
 * `data/languages.json`, which is what tools/seo and astro.config read), so the
 * list is passed in rather than baked in here — the bike site ships six
 * locales, the walking site two.
 */
export function createLanguageSchema<const T extends readonly string[]>(
  codes: T
): z.ZodUnion<
  [
    z.ZodLiteral<T[number]>,
    z.ZodLiteral<T[number]>,
    ...z.ZodLiteral<T[number]>[]
  ]
> {
  return unionOfLiterals(codes) as never;
}

/** Any zod schema usable as the `language` field of a collection entry. */
export type LanguageSchemaLike = z.ZodTypeAny;
