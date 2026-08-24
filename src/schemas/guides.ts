import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';
import { publishedGlob } from 'src/schemas/published-glob';

/**
 * Long-form cycling guides (`/guides/<slug>/`).
 *
 * A guide is a blog post with structure: frontmatter `content_blocks` render
 * above the markdown body (quick answer, route profile, …) and
 * `content_blocks_after` below it (FAQ, author card, …). `summary` is the
 * quotable 40–60 word answer that doubles as the meta description fallback.
 *
 * Cross-links are by entry `id` so a renamed slug cannot break them.
 */
const guideSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  path: z.string().optional().nullable(),
  language: languageSchema,
  date: z.string().or(z.date()),
  // Last substantive revision. Falls back to `date` in the layout and the
  // Article JSON-LD when absent.
  updated: z.string().or(z.date()).optional().nullable(),
  summary: z.string(),
  // Team member id (collections.team). Unlike blog `author`, which is free
  // text, this is a reference so the byline and Article author resolve to the
  // same Person.
  author: z.string().uuid().optional().nullable(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }),
  thumb_image_path: z.string(),
  thumb_image_alt: z.string(),
  tags: z.array(z.string().uuid()).optional().default([]),
  relatedTours: z.array(z.string().uuid()).optional().default([]),
  relatedGuides: z.array(z.string().uuid()).optional().default([]),
  relatedPosts: z.array(z.string().uuid()).optional().default([]),
  content_blocks: z.array(z.any()).optional().default([]),
  content_blocks_after: z.array(z.any()).optional().default([]),
  seo: seoSchema
});

export type GuideSchema = z.infer<typeof guideSchema>;

export const guidesCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/guides'
  }),
  schema: guideSchema
});
