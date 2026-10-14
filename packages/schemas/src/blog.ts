import { z } from 'astro/zod';
import { imageSchema } from './image';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';
import { seoSchema } from './seo';

export function createBlogPostSchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    id: z.string().uuid(),
    path: z.string().optional().nullable(),
    date: z.string().or(z.date()),
    title: z.string(),
    tags: z.array(z.string().uuid()).optional().default([]),
    author: z.string().optional().nullable(),
    thumb_image_path: z.string(),
    thumb_image_alt: z.string(),
    language: languageSchema,
    relatedPosts: z.array(z.string().uuid()).optional().default([]),
    // Tours this article actually discusses. Rendered under the post, and the
    // only structured way to link a post to a tour.
    relatedTours: z.array(z.string().uuid()).optional().default([]),
    image: imageSchema,
    seo: seoSchema
  });
}

export function blogCollection<L extends LanguageSchemaLike>(options: {
  languageSchema: L;
  base?: string;
}) {
  return {
    loader: publishedGlob({
      pattern: '**/*.{md,mdx}',
      base: options.base ?? './src/content/blog'
    }),
    schema: createBlogPostSchema(options.languageSchema)
  };
}
