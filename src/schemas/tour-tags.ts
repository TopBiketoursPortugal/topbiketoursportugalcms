import { publishedGlob } from 'src/schemas/published-glob';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const tourTagSchema = z.object({
  path: z.string().optional().nullable(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  name: z.string().optional(),
  icon: z.string().optional().nullable(),
  content_blocks: z.array(z.any()).optional().default([]),
  content_blocks_after: z.array(z.any()).optional().default([]),
  seo: seoSchema.optional()
});

export const tourTagsCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.md(x)?',
    base: './src/content/tour-tags'
  }),
  schema: tourTagSchema
});
