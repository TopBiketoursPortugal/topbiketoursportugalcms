import { z } from 'astro/zod';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';

export function createTestimonialSchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    id: z.string().uuid(),
    language: languageSchema,
    title: z.string(),
    quote: z.string(),
    date: z.string().or(z.date()),
    reviewSource: z.string().or(z.string().url()).optional(),
    score: z.number().min(0).max(5),
    author: z.object({
      country: z.string().optional(),
      avatar: z.string().optional().nullable(),
      name: z.string().optional()
    }),
    relatedProduct: z.string().uuid().optional().nullable()
  });
}

export function testimonialCollection<L extends LanguageSchemaLike>(options: {
  languageSchema: L;
  base?: string;
}) {
  return {
    loader: publishedGlob({
      pattern: '**/*.md(x)?',
      base: options.base ?? './src/content/testimonials'
    }),
    schema: createTestimonialSchema(options.languageSchema)
  };
}
