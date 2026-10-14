import type { CollectionEntry } from 'astro:content';
import type { ReviewSchema } from 'src/schemas/tours';

/**
 * A review as the UI needs it: the tour schema's shape plus the two fields
 * that only exist on a testimonial entry — when the trip was ridden, and which
 * tour it was. Both were being dropped here, which is why every testimonial on
 * the site rendered as an undated, unattached quote under a flag.
 */
export type MappedReview = ReviewSchema & {
  relatedProduct?: string | null;
};

export function MapTestimonialToReview(
  t: CollectionEntry<'testimonials'>
): MappedReview {
  return {
    content: t.body ?? '',
    rating: t.data.score,
    title: t.data.title,
    // `date` is authored as either an ISO string or a real Date in the CMS;
    // normalising here keeps a single `Date` downstream, so a mapped
    // testimonial stays assignable everywhere a tour's own review is.
    publishDate: t.data.date ? new Date(t.data.date) : undefined,
    relatedProduct: t.data.relatedProduct,
    author: {
      country: t.data.author.country ?? '',
      givenName: t.data.author.name ?? ''
    },
    source: {
      url: t.data.reviewSource,
      name:
        t.data.reviewSource?.indexOf('tripadvisor') !== -1 ? 'TripAdvisor' : ''
    }
  };
}
