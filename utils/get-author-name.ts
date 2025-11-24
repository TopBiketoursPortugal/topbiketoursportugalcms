import type { ReviewSchema } from "src/schemas/tours";

export function getAuthorName(review: ReviewSchema): string {
    if (review.author?.givenName && review.author?.familyName) {
        return `${review.author?.givenName} ${review.author?.familyName}`;
    }

    if (review.author?.givenName) {
        return review.author?.givenName;
    }

    if (review.author?.familyName) {
        return review.author?.familyName;
    }

    return 'Unknown';
}