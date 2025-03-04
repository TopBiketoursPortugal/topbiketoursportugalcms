import { defineCollection, z } from 'astro:content';

import { languageSchema } from './language';
import { glob } from 'astro/loaders';
import { seoSchema } from './seo';

// Schema for individual image objects
const imageSchema = z.object({
  src: z.string(),
  alt: z.string()
});

export const baseSchema = {
  id: z.string().uuid(),
  title: z.string(),
  subTitle: z.string().optional(),
  content: z.string().nullable().optional(),
  image: imageSchema.nullable().optional(),
  order: z.number().optional()
};

// Helper for the location field within itinerary
const locationSchema = z.object({
  lat: z.string().optional(),
  lng: z.string().optional(),
  country: z.enum(['pt', 'es']).optional().default('pt'),
  region: z.string().optional(),
  city: z.string().optional()
});

// Helper for the price object within packages
const priceSchema = z.object({
  currency: z.enum(['EUR', 'USD']).default('EUR'),
  price: z.number().optional().nullable(),
  promo: z.number().optional().nullable(),
  bestValue: z.boolean().optional().nullable().default(false)
});

// Schema for the itinerary items
const itinerarySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: locationSchema.optional()
});

// Schema for the packages
const tourPackageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: priceSchema,
  popular: z.boolean().default(false),
  duration: z.string().default(''),
  included: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        included: z.boolean().default(false),
        info: z.string().default('')
      })
    )
    .optional()
    .nullable()
});

const groupSizeSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional()
});

const reviewSchema = z.object({
  author: z
    .object({
      familyName: z.string().optional(),
      givenName: z.string(),
      country: z.string()
    })
    .optional(),
  travelerType: z
    .union([z.literal('Couple'), z.literal('Solo'), z.literal('Family')])
    .optional(),
  content: z.string(),
  title: z.string(),
  image: imageSchema.optional().nullable(),
  publishDate: z.date().optional(),
  rating: z.number().optional().default(5),
  source: z
    .object({
      name: z.string(),
      url: z.string().url().optional().nullable()
    })
    .optional()
    .nullable()
});

const faqsSchema = z.object({
  question: z.string(),
  answer: z.string()
});

// Main schema for the "tours" collection
const tourSchema = z.object({
  code: z.string(),
  slug: z.string().optional(),
  language: languageSchema, // Assuming `languageField` is a string, adjust as necessary
  id: z.string().uuid(),
  title: z.string(),
  subTitle: z.string().optional(),
  content: z.string().nullable().optional(),
  image: imageSchema.nullable().optional(),
  order: z.number().optional(),
  description: z.string().optional(),
  afterPricing: z.string().optional().nullable(),
  region: z.string().optional(),
  path: z.string().optional().nullable(),
  template: z.string().optional().default('Layout.astro'),
  images: z.array(imageSchema).optional().nullable(),
  itinerary: z.array(itinerarySchema).optional(),
  packages: z.array(tourPackageSchema).optional(),
  seo: seoSchema.optional(),
  tags: z.string().optional(),
  duration: z.number().optional().nullable(),
  distance: z.number().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  skill: z.number().min(1).max(5).optional(),
  length: z.number().optional(),
  mapUrl: z.string().optional(),
  groupSize: groupSizeSchema.optional().nullable(),
  minAge: z.number().optional(),
  highlight: z.enum(['HotTrip', 'BestSeller', 'New']).optional(),
  content_blocks: z.array(z.any()).optional().nullable(),
  type: z
    .enum(['CityTour', 'DayTour', 'PackageTour', 'WalkingTour'])
    .default('PackageTour'),
  reviews: z.array(reviewSchema).optional().default([]),
  faqs: z.array(faqsSchema).optional().default([]),
  relatedTours: z.array(z.string()).optional().default([])
});

export type TourSchema = z.infer<typeof tourSchema>;
export type TourPackageSchema = z.infer<typeof tourPackageSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
export const tourCollection = defineCollection({
  loader: glob({ pattern: '**/*.md(x)?', base: './src/content/tours' }),
  schema: tourSchema
});
