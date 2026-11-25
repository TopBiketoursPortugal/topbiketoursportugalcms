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
  /**
   * One line under the region's grid card on the homepage, where the cards are
   * otherwise a photograph with a single word on it. Not rendered in the
   * footer, where the same card component runs at 120px.
   *
   * Say something only we would know — the climbing starts at the water, the
   * Algarve is the one part of the country that rides in January. A line that
   * restates the region name does not earn the space.
   */
  card_teaser: z.string().optional(),
  content_blocks: z.array(z.any()).optional().default([]),
  content_blocks_after: z.array(z.any()).optional().default([]),
  /**
   * Heading for the multi-day tour grid, overriding the template's
   * "Multi-day bike tours in $1".
   *
   * The default is right for every region that wants to rank for its own
   * "bike tours <place>" phrase. It is wrong for `/tours/regions/porto/`,
   * which is the designated loser for that phrase: its day-tour page
   * `/bike-tours-porto-portugal/` is the page meant to win "bike tours
   * porto", and a template label on the parent page repeating the bigram puts
   * the two back in competition — the thing TOP-12 and this page's rewrite
   * exist to stop. Falls back to the translated default wherever unset.
   */
  package_tours_heading: z.string().optional(),
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
