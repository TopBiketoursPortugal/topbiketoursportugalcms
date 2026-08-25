import { z } from 'astro/zod';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';
import { seoSchema } from './seo';

/**
 * The one shape every taxonomy collection shares — tour regions, tour tags,
 * rider/difficulty levels, blog tags, bike categories. Each is a titled entry
 * with optional CloudCannon content blocks and SEO, addressed by UUID from the
 * entries it classifies.
 */
export function createTaxonomySchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    path: z.string().optional().nullable(),
    language: languageSchema,
    id: z.string().uuid(),
    title: z.string(),
    name: z.string().optional(),
    icon: z.string().optional().nullable(),
    content_blocks: z.array(z.any()).optional().default([]),
    content_blocks_after: z.array(z.any()).optional().default([]),
    seo: seoSchema.optional()
  });
}

/**
 * `{ loader, schema }` for a taxonomy collection — hand it straight to
 * `defineCollection()` in the app's content.config.ts. `base` is the content
 * folder relative to the app root, e.g. `./src/content/tour-regions`.
 */
export function taxonomyCollection<L extends LanguageSchemaLike>(options: {
  base: string;
  languageSchema: L;
}) {
  return {
    loader: publishedGlob({ pattern: '**/*.md(x)?', base: options.base }),
    schema: createTaxonomySchema(options.languageSchema)
  };
}
