import { defineCollection } from 'astro:content';
import { blogCollection, pagesCollection } from '@ttp/schemas';

import { bikeCategoriesCollection } from 'src/schemas/bike-categories';
import { bikesCollection } from 'src/schemas/bikes';
import { postTagsCollection } from 'src/schemas/blog-tags';
import { languageCodes, languageSchema } from 'src/schemas/language';
import { teamCollection } from 'src/schemas/team';
import { testimonialCollection } from 'src/schemas/testimonal';
import { tourRegionsCollection } from 'src/schemas/tour-regions';
import { tourRiderLevelsCollection } from 'src/schemas/tour-rider-levels';
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
  tourRiderLevels: tourRiderLevelsCollection,
  tourRegions: tourRegionsCollection,
  team: teamCollection,
  testimonials: testimonialCollection,
  bikeCategories: bikeCategoriesCollection,
  bikes: bikesCollection
};
