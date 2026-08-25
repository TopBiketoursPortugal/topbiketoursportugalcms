import { defineCollection } from 'astro:content';
import { taxonomyCollection } from '@ttp/schemas';

import { languageSchema } from './language';

// Bike-site-only taxonomy: the bike types (road, gravel, e-bike, …) a tour
// can be ridden on.
export const bikeCategoriesCollection = defineCollection(
  taxonomyCollection({ base: './src/content/bike-categories', languageSchema })
);
