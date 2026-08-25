import { defineCollection } from 'astro:content';
import { taxonomyCollection } from '@ttp/schemas';

import { languageSchema } from './language';

export const tourRegionsCollection = defineCollection(
  taxonomyCollection({ base: './src/content/tour-regions', languageSchema })
);
