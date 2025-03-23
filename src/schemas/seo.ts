import { z } from 'astro:schema';

export const seoSchema = z
  .object({
    page_title: z.string().optional().nullable(),
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
