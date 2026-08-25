import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { createTourSchema, publishedGlob } from '@ttp/schemas';

import { languageSchema } from './language';

export {
  baseSchema,
  type TourPackageSchema,
  type ReviewSchema,
  type ItinerarySchema,
  type TourFeatureSchema
} from '@ttp/schemas';

const tourSchema = createTourSchema({
  languageSchema,
  defaultTourType: 'WalkingTour'
});

export type TourSchema = z.infer<typeof tourSchema>;

export const tourCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.md(x)?',
    base: './src/content/tours'
  }),
  schema: tourSchema
});
