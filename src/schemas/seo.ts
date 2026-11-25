import { z } from 'astro/zod';

export const seoSchema = z
  .object({
    page_title: z.string().optional().nullable(),
    /**
     * Publish `page_title` verbatim, without the site's
     * "%s — Top Bike Tours Portugal" suffix.
     *
     * The suffix is the right default — it is 26 characters of brand on a
     * SERP where nobody knows us. It is wrong in two cases, and both are
     * live: a title already at the ~60-character limit loses its own last
     * clause to make room for it, and a page deliberately kept clear of a
     * phrase cannot carry a suffix containing that phrase.
     * `/tours/regions/porto/` is the second case — it is the designated
     * loser for "bike tours Porto" and must not repeat the bigram its own
     * day-tour page is trying to win.
     */
    page_title_exact: z.boolean().optional().default(false),
    keywords: z.string().optional().nullable(),
    page_description: z.string().optional().nullable(),
    canonical_url: z.string().optional().nullable(),
    featured_image: z.string().optional().nullable(),
    featured_image_alt: z.string().optional().nullable(),
    author_twitter_handle: z.string().optional().nullable(),
    open_graph_type: z.string().optional().nullable(),
    no_index: z.boolean().optional().default(true)
  })
  .optional();

export type SeoSchema = z.infer<typeof seoSchema>;
