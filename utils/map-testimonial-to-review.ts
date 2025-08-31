import type { CollectionEntry } from 'astro:content';
import type { ReviewSchema } from 'src/schemas/tours';

export function MapTestimonialToReview(
  t: CollectionEntry<'testimonials'>
): ReviewSchema {
  return {
    content: t.body ?? '',
    rating: t.data.score,
    title: t.data.title,
    author: {
      country: t.data.author.country ?? '',
      givenName: t.data.author.name ?? ''
    },
    source: {
      url: t.data.reviewSource,
      name:
        t.data.reviewSource?.indexOf('tripadvisor') !== -1 ? 'TripAdvisor' : ''
    }
  } satisfies ReviewSchema;
}
