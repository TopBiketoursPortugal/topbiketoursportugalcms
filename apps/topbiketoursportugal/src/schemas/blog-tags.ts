import { defineCollection } from 'astro:content';
import { taxonomyCollection } from '@ttp/schemas';

import { languageSchema } from './language';

export const postTagsCollection = defineCollection(
  taxonomyCollection({ base: './src/content/blog-tags', languageSchema })
);
