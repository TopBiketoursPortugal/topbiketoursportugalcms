import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { languageSchema } from 'src/schemas/language';
import { postTagsCollection } from 'src/schemas/post-tags';
import { seoSchema } from 'src/schemas/seo';
import { teamCollection } from 'src/schemas/team';
import { testimonialCollection } from 'src/schemas/testimonal';
import { tourRegionsCollection } from 'src/schemas/tour-regions';
import { tourTagsCollection } from 'src/schemas/tour-tags';
import { tourCollection } from 'src/schemas/tours';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    id: z.string().uuid(),
    path: z.string().optional().nullable(),
    date: z.string().or(z.date()),
    title: z.string(),
    tags: z.array(z.string()).optional().nullable(),
    author: z.string().optional().nullable(),
    thumb_image_path: z.string(),
    thumb_image_alt: z.string(),
    language: languageSchema,
    relatedPosts: z.array(z.string().uuid()).optional().default([]),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }),
    seo: seoSchema
  })
});

const pageSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  language: languageSchema,
  template: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  content_blocks: z.array(z.any()),
  content_blocks_after: z.array(z.any()).optional().nullable(),
  seo: seoSchema,
  showPageTitle: z.boolean().optional().default(false)
});

const featuredPostSchema = z.object({
  main_feature: z.string().uuid().optional().nullable(),
  feature_list: z.array(z.string().uuid()).optional().nullable()
});

export type FeaturedPost = z.infer<typeof featuredPostSchema>;

const paginatedCollectionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  language: languageSchema,
  template: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  page_size: z.number().positive(),
  featured_posts: featuredPostSchema,
  showPageTitle: z.boolean().optional().default(false),
  seo: seoSchema
});

const pagesCollection = defineCollection({
  loader: glob({
    pattern: ['./*.{md,mdx}', './pt/*.{md,mdx}'],
    base: './src/content/pages'
  }),
  schema: z.union([paginatedCollectionSchema, pageSchema])
});

export const collections = {
  blog: blogCollection,
  postTags: postTagsCollection,
  pages: pagesCollection,
  tours: tourCollection,
  tourTags: tourTagsCollection,
  tourRegions: tourRegionsCollection,
  team: teamCollection,
  testimonials: testimonialCollection
};
