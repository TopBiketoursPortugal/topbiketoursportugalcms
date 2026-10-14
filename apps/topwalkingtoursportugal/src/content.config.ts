import { defineCollection } from 'astro:content';
import { blogCollection, pagesCollection } from '@ttp/schemas';

import { postTagsCollection } from 'src/schemas/blog-tags';
import { languageCodes, languageSchema } from 'src/schemas/language';
import { teamCollection } from 'src/schemas/team';
import { testimonialCollection } from 'src/schemas/testimonal';
import { tourRegionsCollection } from 'src/schemas/tour-regions';
import { tourTagsCollection } from 'src/schemas/tour-tags';
import { tourCollection } from 'src/schemas/tours';

export type { FeaturedPost } from '@ttp/schemas';

export const collections = {
  blog: defineCollection(blogCollection({ languageSchema })),
  postTags: postTagsCollection,
  pages: defineCollection(
    pagesCollection({ languageSchema, languageCodes, defaultLanguage: 'en' })
  ),
  tours: tourCollection,
  tourTags: tourTagsCollection,
  tourRegions: tourRegionsCollection,
  team: teamCollection,
  testimonials: testimonialCollection
};
