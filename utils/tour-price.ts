import type { TourSchema } from 'src/schemas/tours';

/**
 * The "from" price a tour advertises, in its own currency.
 *
 * Only `packages` counts. `packages2` and `packages3` are the seasons and
 * add-ons tables, which carry zero-priced columns — including them drags the
 * minimum to 0. This mirrors the derivation in
 * src/components/tours/tour-page.astro, which is the price a visitor actually
 * sees in the sidebar; schema that disagrees with the visible price is a
 * structured-data violation, so the two have to come from the same rule.
 *
 * Returns null when a tour publishes no usable price, so callers can leave it
 * out of an aggregate rather than averaging in a zero.
 */
export function tourFromPrice(
  tour: Pick<TourSchema, 'packages'>
): { amount: number; currency: 'EUR' | 'USD' } | null {
  const packages = tour.packages ?? [];
  const amounts = packages
    .map((p) => {
      const promo = p.price?.promo ?? 0;
      const list = p.price?.price ?? 0;
      // A promo price is what is charged, so it is the price to publish.
      return promo > 0 ? promo : list;
    })
    .filter((amount) => amount > 0);

  if (amounts.length === 0) return null;

  return {
    amount: Math.min(...amounts),
    currency: packages[0]?.price?.currency ?? 'EUR'
  };
}
