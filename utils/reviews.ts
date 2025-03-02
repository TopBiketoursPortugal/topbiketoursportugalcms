import type { ReviewSchema } from 'src/schemas/tours';

const defaultAggregateRating = {
  average: 0,
  max: 0,
  min: 0,
  total: 0,
  count: 0
} as const;

export type AggregateRatings = {
  average: number;
  max: number;
  min: number;
  total: number;
  count: number;
};

export function getAggregatedReviews(
  reviews: ReviewSchema[] | undefined = []
): AggregateRatings {
  if (!reviews || reviews.length === 0) {
    return defaultAggregateRating;
  }

  const ratings = reviews.map((r) => r.rating);
  const max = Math.max(...ratings);
  const min = Math.min(...ratings);
  const total = ratings.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return {
    count: ratings.length,
    average: total / ratings.length,
    max,
    min,
    total
  };
}
