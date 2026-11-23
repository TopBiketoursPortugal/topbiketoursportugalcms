import { publishedGlob } from 'src/schemas/published-glob';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';

const tourRegionSchema = z.object({
  path: z.string().optional().nullable(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  name: z.string().optional(),
  /**
   * Anchor text for the region cards that link here from the homepage and the
   * tours listing. Separate from `name` on purpose: `name` is a short label and
   * also feeds the breadcrumb, the mega menu and the Place schema, where
   * "Porto" reads correctly and "Porto bike tours" does not. The card is a
   * body-copy link into a page that has to rank for a phrase, so it needs the
   * phrase. Falls back to `name` wherever this is unset.
   */
  link_text: z.string().optional(),
  content_blocks: z.array(z.any()).optional().default([]),
  content_blocks_after: z.array(z.any()).optional().default([]),
  // Suppress the region page's day-tour section when those day tours already
  // have a page of their own. `/tours/regions/porto/` and
  // `/bike-tours-porto-portugal/` shared 5 of their 6 day-tour cards, so the two
  // pages were competing for the same Porto queries with near-identical card
  // sets. The region page keeps its multi-day tours; the day page keeps the day
  // tours. Defaults to `true`, so no region changes behaviour unless it opts in.
  showDayTours: z.boolean().optional().default(true),
  seo: seoSchema.optional()
});

export const tourRegionsCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.md(x)?',
    base: './src/content/tour-regions'
  }),
  schema: tourRegionSchema
});
