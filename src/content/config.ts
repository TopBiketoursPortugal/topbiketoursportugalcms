import { defineCollection, z } from 'astro:content';
import { languageSchema } from 'src/schemas/language';
import { seoSchema } from 'src/schemas/seo';
import { teamCollection } from 'src/schemas/team';
import { tourCollection } from 'src/schemas/tours';

const blogCollection = defineCollection({
  schema: z.object({
    date: z.string().or(z.date()),
    title: z.string(),
    tags: z.array(z.string()).optional().nullable(),
    author: z.string(),
    thumb_image_path: z.string(),
    thumb_image_alt: z.string(),
    language: languageSchema,
    image: z.object({
      src: z.string(),
      alt: z.string()
    }),
    seo: seoSchema
  })
});

const pageSchema = z.object({
  title: z.string(),
  language: languageSchema,
  template: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  content_blocks: z.array(z.any()),
  seo: seoSchema
});

const paginatedCollectionSchema = z.object({
  title: z.string(),
  slug: z.string().optional().nullable(),
  template: z.string().optional().nullable(),
  language: languageSchema,
  page_size: z.number().positive(),
  featured_posts: z.object({
    main_feature: z.string(),
    feature_list: z.array(z.string())
  }),
  seo: seoSchema
});

const pagesCollection = defineCollection({
  schema: z.union([paginatedCollectionSchema, pageSchema])
});

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
  tours: tourCollection,
  team: teamCollection
};
