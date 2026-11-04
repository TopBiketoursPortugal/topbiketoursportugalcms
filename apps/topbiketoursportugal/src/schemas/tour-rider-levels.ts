import { defineCollection } from 'astro:content';
import { taxonomyCollection } from '@ttp/schemas';

import { languageSchema } from './language';

export const tourRiderLevelsCollection = defineCollection(
  taxonomyCollection({
    base: './src/content/tour-rider-levels',
    languageSchema
  })
);
