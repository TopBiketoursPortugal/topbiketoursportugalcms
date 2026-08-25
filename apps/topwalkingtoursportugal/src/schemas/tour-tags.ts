import { defineCollection } from 'astro:content';
import { taxonomyCollection } from '@ttp/schemas';

import { languageSchema } from './language';

export const tourTagsCollection = defineCollection(
  taxonomyCollection({ base: './src/content/tour-tags', languageSchema })
);
