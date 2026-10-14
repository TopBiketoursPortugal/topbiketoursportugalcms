import { z } from 'astro/zod';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';
import { seoSchema } from './seo';

export function createPageSchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    id: z.string().uuid(),
    title: z.string(),
    language: languageSchema,
    template: z.string().optional().nullable(),
    path: z.string().optional().nullable(),
    content_blocks: z.array(z.any()),
    content_blocks_after: z.array(z.any()).optional().nullable(),
    seo: seoSchema,
    showPageTitle: z.boolean().optional().default(false)
  });
}

export const featuredPostSchema = z.object({
  main_feature: z.string().uuid().optional().nullable(),
  feature_list: z.array(z.string().uuid()).optional().nullable()
});

export type FeaturedPost = z.infer<typeof featuredPostSchema>;

export function createPaginatedCollectionSchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    id: z.string().uuid(),
    title: z.string(),
    language: languageSchema,
    template: z.string().optional().nullable(),
    path: z.string().optional().nullable(),
    page_size: z.number().positive(),
    featured_posts: featuredPostSchema,
    showPageTitle: z.boolean().optional().default(false),
    seo: seoSchema
  });
}

/**
 * The `pages` collection: one folder per non-default language, no deeper — a
 * stray subfolder must not turn into a page. `languageCodes` is the app's
 * full locale list; `defaultLanguage` is the one that lives unprefixed at the
 * collection root.
 */
export function pagesCollection<L extends LanguageSchemaLike>(options: {
  languageSchema: L;
  languageCodes: readonly string[];
  defaultLanguage?: string;
  base?: string;
}) {
  const defaultLanguage = options.defaultLanguage ?? 'en';
  return {
    loader: publishedGlob({
      pattern: [
        './*.{md,mdx}',
        ...options.languageCodes
          .filter((l) => l !== defaultLanguage)
          .map((l) => `./${l}/*.{md,mdx}`)
      ],
      base: options.base ?? './src/content/pages'
    }),
    schema: z.union([
      createPaginatedCollectionSchema(options.languageSchema),
      createPageSchema(options.languageSchema)
    ])
  };
}
