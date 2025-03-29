import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const postTagsSchema = z.object({
  path: z.string().optional().nullable(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  name: z.string().optional(),
  seo: seoSchema.optional()
});

export const postTagsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/post-tags' }),
  schema: postTagsSchema
});
