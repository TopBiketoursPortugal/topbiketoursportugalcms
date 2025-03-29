import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const tourRegionSchema = z.object({
  path: z.string().optional().nullable(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  name: z.string().optional(),
  seo: seoSchema.optional()
});

export const tourRegionsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/tour-regions' }),
  schema: tourRegionSchema
});
