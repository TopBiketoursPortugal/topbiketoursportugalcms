import { getTourById, type Tour } from '@/data/tours';
import { useAuth } from '@/lib/auth';
import type { Booking } from '@/data/bookings';

/** The signed-in rider's booking + matching tour, in one call. */
export function useMyTour(): { booking: Booking; tour: Tour } | null {
  const { session } = useAuth();
  if (!session) return null;
  const tour = getTourById(session.tourId);
  if (!tour) return null;
  return { booking: session, tour };
}

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}
