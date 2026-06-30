import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const postTagsSchema = z.object({
  path: z.string().optional().nullable(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  name: z.string().optional(),
  content_blocks: z.array(z.any()).optional().default([]),
  content_blocks_after: z.array(z.any()).optional().default([]),
  seo: seoSchema.optional()
});

export const postTagsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/blog-tags' }),
  schema: postTagsSchema
});
