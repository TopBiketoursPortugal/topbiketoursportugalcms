import { z } from 'astro/zod';
import { imageSchema } from './image';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';
import { seoSchema } from './seo';

export const baseSchema = {
  id: z.string().uuid(),
  title: z.string(),
  subTitle: z.string().optional(),
  content: z.string().nullable().optional(),
  image: imageSchema.nullable().optional(),
  order: z.number().optional()
};

const locationSchema = z.object({
  lat: z.string().optional(),
  lng: z.string().optional(),
  country: z.enum(['pt', 'es']).optional().default('pt'),
  region: z.string().optional().default(''),
  city: z.string().optional()
});

const priceSchema = z.object({
  currency: z.enum(['EUR', 'USD']).default('EUR'),
  price: z.number().optional().nullable(),
  promo: z.number().optional().nullable(),
  bestValue: z.boolean().optional().nullable().default(false)
});

const itinerarySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: locationSchema.optional()
});

const tourPackageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: priceSchema,
  popular: z.boolean().default(false),
  duration: z.coerce.string().default(''),
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
  id: z.string().uuid().optional().nullable(),
  author: z
    .object({
      familyName: z.string().optional().nullable(),
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

const featureSchema = z.object({
  bokunLink: z.string().url().optional().nullable(),
  bokunId: z.string().optional(),
  textcolor: z.enum(['white', 'black', 'custom']).optional().default('white'),
  subtitle: z.string().optional(),
  title: z.string(),
  image: z.string().refine((val) => val.startsWith('/src/assets/images/'), {
    message: "Image path must start with '/src/assets/images/'"
  }),
  bokunLinkText: z.string().optional().default('Book now')
});

export const tourTypes = [
  'CityTour',
  'DayTour',
  'PackageTour',
  'WalkingTour'
] as const;

export type TourType = (typeof tourTypes)[number];

export interface TourSchemaOptions<
  L extends LanguageSchemaLike,
  E extends z.ZodRawShape
> {
  languageSchema: L;
  /**
   * Fields only this site's tours carry — the bike site adds
   * `bikeCategories`, the walking site nothing. Merged over the shared shape.
   */
  extend?: E;
  /** Default `tourtype` for entries that don't set one. */
  defaultTourType?: TourType;
  /** WeTravel organisation id used as the default booking `wetravel.uid`. */
  wetravelUid?: string;
}

/**
 * The tour schema common to both sites. Everything a tour *is* — itinerary,
 * pricing packages, reviews, FAQs, difficulty, group size, booking hooks —
 * lives here so the two sites' tour data stays the same shape; only
 * site-specific classification fields are added through `extend`.
 */
export function createTourSchema<
  L extends LanguageSchemaLike,
  E extends z.ZodRawShape = Record<never, never>
>(options: TourSchemaOptions<L, E>) {
  const shared = z.object({
    code: z.string(),
    path: z.string().optional().nullable(),
    language: options.languageSchema,
    ...baseSchema,
    description: z.string().optional(),
    afterPricing: z.string().optional().nullable(),
    packagesTitle: z.string().optional().nullable(),
    packages2: z.array(tourPackageSchema).optional().nullable(),
    packages2Title: z.string().optional().nullable(),
    packages3: z.array(tourPackageSchema).optional().nullable(),
    packages3Title: z.string().optional().nullable(),
    region: z.string().optional().default(''),
    template: z.string().optional().default('Layout.astro'),
    images: z.array(imageSchema).optional().nullable(),
    itinerary: z.array(itinerarySchema).optional(),
    packages: z.array(tourPackageSchema).optional(),
    seo: seoSchema.optional(),
    tags: z.array(z.string().uuid()).optional().default([]),
    riderLevels: z.array(z.string().uuid()).optional().default([]),
    duration: z.coerce.string().optional().nullable(),
    distance: z.number().optional(),
    difficulty: z.number().min(1).max(5).optional(),
    skill: z.number().min(1).max(5).optional(),
    length: z.number().optional(),
    mapUrl: z.string().optional(),
    groupSize: groupSizeSchema.optional().nullable(),
    minAge: z.number().optional(),
    highlight: z.enum(['HotTrip', 'BestSeller', 'New']).optional(),
    content_blocks: z.array(z.any()).optional().nullable(),
    tourtype: z
      .enum(tourTypes)
      .default(options.defaultTourType ?? 'PackageTour'),
    reviews: z.array(reviewSchema).optional().default([]),
    faqs: z.array(faqsSchema).optional().default([]),
    relatedTours: z.array(z.string().uuid()).optional().default([]),
    feature: featureSchema.optional().nullable(),
    wetravel: z
      .object({
        uid: z
          .string()
          .optional()
          .default(options.wetravelUid ?? ''),
        guidedUuid: z.string().optional().nullable(),
        selfGuidedUuid: z.string().optional().nullable()
      })
      .optional()
      .nullable(),
    closestAirport: z.string().optional().nullable(),
    isNewTour: z.boolean().optional().nullable().default(false)
  });

  return shared.extend((options.extend ?? {}) as E);
}

export function tourCollection<
  L extends LanguageSchemaLike,
  E extends z.ZodRawShape = Record<never, never>
>(options: TourSchemaOptions<L, E> & { base?: string }) {
  return {
    loader: publishedGlob({
      pattern: '**/*.md(x)?',
      base: options.base ?? './src/content/tours'
    }),
    schema: createTourSchema(options)
  };
}

export type TourPackageSchema = z.infer<typeof tourPackageSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
export type ItinerarySchema = z.infer<typeof itinerarySchema>;
export type TourFeatureSchema = z.infer<typeof featureSchema>;
