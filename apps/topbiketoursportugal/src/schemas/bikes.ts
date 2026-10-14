import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { imageSchema, publishedGlob } from '@ttp/schemas';

import { languageSchema } from './language';

// Bike-site-only collection: the rental fleet.
const bikeSchema = z.object({
  language: languageSchema,
  id: z.string().uuid(),
  title: z.string(),
  category: z.string().uuid(),
  image: imageSchema,
  specs: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  frameType: z.string().optional().nullable(),
  infoUrl: z.string().url().optional().nullable(),
  order: z.number().optional().default(0)
});

export const bikesCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.md(x)?',
    base: './src/content/bikes'
  }),
  schema: bikeSchema
});
