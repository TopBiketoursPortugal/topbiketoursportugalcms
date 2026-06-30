import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const bikeCategorySchema = z.object({
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

export const bikeCategoriesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/bike-categories' }),
  schema: bikeCategorySchema
});
