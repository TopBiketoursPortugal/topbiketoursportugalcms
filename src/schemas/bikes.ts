import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { languageSchema } from './language';

const bikeSchema = z.object({
  language: languageSchema,
  id: z.string().uuid(),
  title: z.string(),
  category: z.string().uuid(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }),
  specs: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  frameType: z.string().optional().nullable(),
  infoUrl: z.string().url().optional().nullable(),
  order: z.number().optional().default(0)
});

export const bikesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/bikes' }),
  schema: bikeSchema
});
