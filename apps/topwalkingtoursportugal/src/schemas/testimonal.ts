import { defineCollection } from 'astro:content';
import { testimonialCollection as shared } from '@ttp/schemas';

import { languageSchema } from './language';

export const testimonialCollection = defineCollection(
  shared({ languageSchema })
);
