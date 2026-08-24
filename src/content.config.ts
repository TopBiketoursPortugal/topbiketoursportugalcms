import { publishedGlob } from 'src/schemas/published-glob';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { languageSchema, languageCodes } from 'src/schemas/language';
import { postTagsCollection } from 'src/schemas/blog-tags';
import { seoSchema } from 'src/schemas/seo';
import { teamCollection } from 'src/schemas/team';
import { testimonialCollection } from 'src/schemas/testimonal';
import { tourRegionsCollection } from 'src/schemas/tour-regions';
import { tourTagsCollection } from 'src/schemas/tour-tags';
import { tourRiderLevelsCollection } from 'src/schemas/tour-rider-levels';
import { bikeCategoriesCollection } from 'src/schemas/bike-categories';
import { bikesCollection } from 'src/schemas/bikes';
import { tourCollection } from 'src/schemas/tours';
import { guidesCollection } from 'src/schemas/guides';

const blogCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog'
  }),
  schema: z.object({
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
    // only structured way to link a post to a tour — 38 posts covered these
    // routes in prose while linking none of them.
    relatedTours: z.array(z.string().uuid()).optional().default([]),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }),
    // Retires the post: a non-empty value removes it from every collection
    // query (src/schemas/published-glob.ts) and 301s its URL to this path
    // (tools/seo/lib/routes.mjs `redirectedRoutes`). Declared here only so
    // CloudCannon's schema and the zod type agree; the loader reads it from
    // the file, not from `entry.data`.
    redirect_to: z.string().optional().nullable(),
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
  // Which collection the block features. Blog posts use main_feature /
  // feature_list; guides use main_guide / guide_list (separate fields so
  // CloudCannon can offer the right collection in each picker).
  collection: z.enum(['blog', 'guides']).optional().default('blog'),
  main_feature: z.string().uuid().optional().nullable(),
  feature_list: z.array(z.string().uuid()).optional().nullable(),
  main_guide: z.string().uuid().optional().nullable(),
  guide_list: z.array(z.string().uuid()).optional().nullable()
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
  loader: publishedGlob({
    // One folder per non-default language, no deeper — a stray subfolder
    // must not turn into a page.
    pattern: [
      './*.{md,mdx}',
      ...languageCodes.filter((l) => l !== 'en').map((l) => `./${l}/*.{md,mdx}`)
    ],
    base: './src/content/pages'
  }),
  schema: z.union([paginatedCollectionSchema, pageSchema])
});

export const collections = {
  blog: blogCollection,
  guides: guidesCollection,
  postTags: postTagsCollection,
  pages: pagesCollection,
  tours: tourCollection,
  tourTags: tourTagsCollection,
  tourRiderLevels: tourRiderLevelsCollection,
  tourRegions: tourRegionsCollection,
  team: teamCollection,
  testimonials: testimonialCollection,
  bikeCategories: bikeCategoriesCollection,
  bikes: bikesCollection
};
