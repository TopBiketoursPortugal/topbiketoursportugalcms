import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { languageSchema } from './language';

// id:
// language: en
// title:
// quote:
// date:
// reviewSource:
// score:
// author:
//   country:
//   avatar:
//   name:
// relatedProduct:

const testimonial = z.object({
  id: z.string().uuid(),
  language: languageSchema,
  title: z.string(),
  quote: z.string(),
  date: z.string().or(z.date()),
  reviewSource: z.string().or(z.string().url()).optional(),
  score: z.number().min(0).max(5),
  author: z.object({
    country: z.string().optional(),
    avatar: z.string().optional(),
    name: z.string().optional()
  }),
  relatedProduct: z.string().uuid().optional().nullable()
});

export const testimonialCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/testimonials' }),
  schema: testimonial
});
