/**
 * Stand-in for the WeTravel → Rota booking sync described in the spec
 * (webhook or nightly job, keyed by `wetravel.uid`). In production this
 * list lives in the backend database, not the app bundle — see
 * README.md → "Before this ships".
 */

export type Booking = {
  phone: string;
  riderName: string;
  tourId: string;
  startDate: string; // ISO date
  bookingRef: string;
  guide: { name: string; phone: string };
};

export const mockBookings: Booking[] = [
  {
    phone: '+351912345678',
    riderName: 'Alex Rider',
    tourId: 'coastal-way-santiago',
    startDate: '2026-09-12',
    bookingRef: 'WT-23175',
    guide: { name: 'Sérgio Pinto', phone: '+351911000000' }
  }
];

function normalize(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}

export function findBookingByPhone(phone: string): Booking | undefined {
  const target = normalize(phone);
  return mockBookings.find((b) => normalize(b.phone) === target);
}
