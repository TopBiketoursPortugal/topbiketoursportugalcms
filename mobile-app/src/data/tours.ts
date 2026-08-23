/**
 * Launch catalogue for Rota.
 *
 * Every field below (region, days, distance, ascent, itinerary stops,
 * sightseeing highlights) is carried over from this project's own
 * `src/content/tours/*.mdx` collection — nothing here is invented.
 *
 * Two exceptions:
 *   - `elevationProfile` is an illustrative shape (0–1, low-to-high)
 *     standing in for a real per-kilometre profile.
 *   - `waypoints` are real town/city coordinates for each named stop in
 *     the tour's own itinerary copy, but the *line between* them is a
 *     straight bearing, not the actual paved/gravel route a rider follows.
 *
 * Swap both for data derived from each tour's real GPX file before this
 * ships — see README.md → "Before this ships".
 */

export type ClimbLevel = 'easy' | 'moderate' | 'epic';

export type Waypoint = { label: string; lat: number; lng: number };

export type Tour = {
  id: string;
  name: string;
  region: string;
  climbLevel: ClimbLevel;
  climbLabel: string;
  distanceKm: string;
  days: string;
  ascent: string;
  route: string;
  highlights: string[];
  /**
   * Real coordinates for the subset of `highlights` that name one specific,
   * confidently-locatable landmark (e.g. "Santiago Cathedral") — shown as
   * pins on the Route tab map. Most `highlights` entries are regional or
   * thematic ("Wild Atlantic cliffs", "Vinho Verde country") and
   * deliberately have no entry here rather than a guessed point; see the
   * "📍 on the route map" badge logic in app/(app)/sightseeing.tsx.
   */
  highlightPins?: { label: string; lat: number; lng: number }[];
  /** Ordered stop-to-stop chain, start to finish — at least one point. */
  waypoints: [Waypoint, ...Waypoint[]];
  elevationProfile: number[];
};

export const tours: Tour[] = [
  {
    id: 'french-way-camino',
    name: 'Full French Way — Camino de Santiago',
    region: 'Camino de Santiago',
    climbLevel: 'epic',
    climbLabel: 'Epic',
    distanceKm: '791',
    days: '16',
    ascent: '12,000 m ascent',
    route:
      'Saint-Jean-Pied-de-Port → Pamplona → Burgos → León → Santiago de Compostela',
    highlights: [
      'Pyrenees passes',
      'Meseta plains',
      'Santiago Cathedral · UNESCO'
    ],
    highlightPins: [
      { label: 'Santiago Cathedral · UNESCO', lat: 42.8806, lng: -8.5449 }
    ],
    waypoints: [
      { label: 'Saint-Jean-Pied-de-Port', lat: 43.163, lng: -1.238 },
      { label: 'Pamplona', lat: 42.8125, lng: -1.6458 },
      { label: 'Burgos', lat: 42.3439, lng: -3.6969 },
      { label: 'León', lat: 42.5987, lng: -5.5671 },
      { label: 'Santiago de Compostela', lat: 42.878, lng: -8.545 }
    ],
    elevationProfile: [
      0.3, 0.9, 0.5, 0.4, 0.7, 0.35, 0.6, 0.3, 0.45, 0.2, 0.5, 0.25
    ]
  },
  {
    id: 'coastal-way-santiago',
    name: 'Porto to Santiago — Coastal Way',
    region: 'Camino Português',
    climbLevel: 'moderate',
    climbLabel: 'Moderate',
    distanceKm: '278',
    days: '8',
    ascent: 'Flat–rolling terrain',
    route:
      'Porto → Vila do Conde → Viana do Castelo → Caminha → Pontevedra → Santiago',
    highlights: [
      'Atlantic coast paths',
      'Camino Português',
      'Santiago Cathedral'
    ],
    highlightPins: [
      { label: 'Santiago Cathedral', lat: 42.8806, lng: -8.5449 }
    ],
    waypoints: [
      { label: 'Porto', lat: 41.158, lng: -8.629 },
      { label: 'Vila do Conde', lat: 41.3515, lng: -8.7444 },
      { label: 'Viana do Castelo', lat: 41.6932, lng: -8.833 },
      { label: 'Caminha', lat: 41.8756, lng: -8.8385 },
      { label: 'Pontevedra', lat: 42.431, lng: -8.6444 },
      { label: 'Santiago de Compostela', lat: 42.878, lng: -8.545 }
    ],
    elevationProfile: [0.2, 0.3, 0.25, 0.4, 0.3, 0.35, 0.25, 0.2]
  },
  {
    id: 'douro-valley-wine',
    name: 'Douro Valley Wine Cycling Tour',
    region: 'Douro',
    climbLevel: 'easy',
    climbLabel: 'Easy',
    distanceKm: '133',
    days: '7',
    ascent: '1,895 m ascent',
    route:
      'Lamego → Régua → Pinhão → Tabuaço → Marialva → Vila Nova de Foz Côa',
    highlights: [
      'UNESCO wine terraces',
      'Foz Côa rock art',
      'Wine estate visits'
    ],
    highlightPins: [{ label: 'Foz Côa rock art', lat: 41.0875, lng: -7.1007 }],
    waypoints: [
      { label: 'Lamego', lat: 41.094, lng: -7.813 },
      { label: 'Régua', lat: 41.1621, lng: -7.7897 },
      { label: 'Pinhão', lat: 41.189, lng: -7.546 },
      { label: 'Tabuaço', lat: 41.1167, lng: -7.5667 },
      { label: 'Marialva', lat: 40.9333, lng: -7.2833 },
      { label: 'Vila Nova de Foz Côa', lat: 41.087, lng: -7.134 }
    ],
    elevationProfile: [0.15, 0.3, 0.5, 0.25, 0.4, 0.2, 0.15]
  },
  {
    id: 'porto-lisbon-atlantic',
    name: 'Porto to Lisbon — Atlantic Coast',
    region: 'Green & Silver Coast',
    climbLevel: 'moderate',
    climbLabel: 'Easy–Moderate',
    distanceKm: '493',
    days: '13',
    ascent: 'Coastal terrain',
    route: 'Porto → Aveiro → Nazaré → Óbidos → Sintra → Lisbon',
    highlights: [
      'Aveiro canals',
      'Nazaré big waves',
      'Sintra palaces · UNESCO'
    ],
    highlightPins: [
      { label: 'Nazaré big waves', lat: 39.6077, lng: -9.0847 },
      { label: 'Sintra palaces · UNESCO', lat: 38.7876, lng: -9.3906 }
    ],
    waypoints: [
      { label: 'Porto', lat: 41.158, lng: -8.629 },
      { label: 'Aveiro', lat: 40.6405, lng: -8.6538 },
      { label: 'Nazaré', lat: 39.6011, lng: -9.0714 },
      { label: 'Óbidos', lat: 39.3608, lng: -9.1571 },
      { label: 'Sintra', lat: 38.7999, lng: -9.3906 },
      { label: 'Lisbon', lat: 38.722, lng: -9.139 }
    ],
    elevationProfile: [0.15, 0.2, 0.3, 0.2, 0.45, 0.3, 0.5, 0.25, 0.2]
  },
  {
    id: 'vicentine-algarve',
    name: 'Vicentine Coast & Algarve Bike Tour',
    region: 'Alentejo & Algarve',
    climbLevel: 'moderate',
    climbLabel: 'Moderate',
    distanceKm: '378',
    days: '8',
    ascent: '3,628 m ascent',
    route:
      'Lisbon / Sines → SW Alentejano Natural Park → Cape Sardão → Cape São Vicente',
    highlights: ['Wild Atlantic cliffs', 'Cork oak groves', 'Fishing villages'],
    waypoints: [
      { label: 'Sines', lat: 37.956, lng: -8.864 },
      { label: 'Cape Sardão', lat: 37.5978, lng: -8.7994 },
      { label: 'Cape São Vicente', lat: 37.021, lng: -8.942 }
    ],
    elevationProfile: [0.2, 0.3, 0.25, 0.35, 0.3, 0.5, 0.4, 0.6]
  },
  {
    id: 'north-minho',
    name: 'North of Portugal & Minho',
    region: 'Porto / North',
    climbLevel: 'easy',
    climbLabel: 'Easy',
    distanceKm: '238',
    days: '7',
    ascent: 'Flat terrain',
    route: 'Melgaço → Valença → Viana do Castelo → Ponte de Lima → Porto',
    highlights: [
      'Minho River trail',
      'Historic border towns',
      'Vinho Verde country'
    ],
    waypoints: [
      { label: 'Melgaço', lat: 42.117, lng: -8.267 },
      { label: 'Valença', lat: 42.0281, lng: -8.6408 },
      { label: 'Viana do Castelo', lat: 41.6932, lng: -8.833 },
      { label: 'Ponte de Lima', lat: 41.7702, lng: -8.5814 },
      { label: 'Porto', lat: 41.158, lng: -8.629 }
    ],
    elevationProfile: [0.3, 0.15, 0.2, 0.15, 0.25, 0.15, 0.2]
  },
  {
    id: 'douro-full-day',
    name: 'Douro Valley Full-Day Ride',
    region: 'Douro',
    climbLevel: 'easy',
    climbLabel: 'Easy · self-paced',
    distanceKm: '25–77 (options)',
    days: '1',
    ascent: 'Rail trail surface',
    route: 'Vila Real → Régua → Lamego → Pinhão (Ecopista do Corgo rail trail)',
    highlights: ['Vineyard viewpoints', 'Farm & wine visit', 'Douro River'],
    waypoints: [
      { label: 'Vila Real', lat: 41.301, lng: -7.744 },
      { label: 'Régua', lat: 41.1621, lng: -7.7897 },
      { label: 'Lamego', lat: 41.094, lng: -7.813 },
      { label: 'Pinhão', lat: 41.189, lng: -7.546 }
    ],
    elevationProfile: [0.35, 0.15, 0.2, 0.3, 0.2, 0.25]
  },
  {
    id: 'valongo-mtb',
    name: 'Mountain Bike Tour — Valongo',
    region: 'Porto / North',
    climbLevel: 'moderate',
    climbLabel: 'Moderate–Technical',
    distanceKm: '20–50 (options)',
    days: '½–1',
    ascent: 'MTB single track',
    route: 'Valongo Mountains — single tracks past the schist village of Couce',
    highlights: ['Summit viewpoint', 'Riverside trails', '20 min from Porto'],
    waypoints: [{ label: 'Valongo', lat: 41.186, lng: -8.5 }],
    elevationProfile: [0.2, 0.5, 0.35, 0.7, 0.4, 0.6, 0.3]
  },
  {
    id: 'porto-downtown',
    name: 'Porto Downtown & Sightseeing',
    region: 'Porto',
    climbLevel: 'easy',
    climbLabel: 'Easy · leisure',
    distanceKm: '7',
    days: '3h',
    ascent: 'City terrain',
    route: 'City centre → Avenida da Boavista → riverside & sea promenade',
    highlights: ['19th-c. palaces', 'City parks', 'Ocean views'],
    highlightPins: [{ label: '19th-c. palaces', lat: 41.1496, lng: -8.6231 }], // Jardins do Palácio de Cristal
    waypoints: [
      { label: 'City centre', lat: 41.1496, lng: -8.6109 },
      { label: 'Avenida da Boavista', lat: 41.1579, lng: -8.6296 },
      { label: 'Foz do Douro', lat: 41.1497, lng: -8.6892 }
    ],
    elevationProfile: [0.15, 0.2, 0.15, 0.25, 0.15]
  },
  {
    id: 'porto-food-wine',
    name: 'Porto Food & Wine Bike Tour',
    region: 'Porto',
    climbLevel: 'easy',
    climbLabel: 'Easy · leisure',
    distanceKm: '7',
    days: '6h',
    ascent: 'Riverside terrain',
    route: 'Douro riverside → Café Majestic → Vila Nova de Gaia wine cellars',
    highlights: ['Port wine tasting', 'Wine museum', 'Local lunch'],
    waypoints: [
      { label: 'Ribeira', lat: 41.1405, lng: -8.6118 },
      { label: 'Café Majestic', lat: 41.1472, lng: -8.6058 },
      { label: 'Vila Nova de Gaia', lat: 41.1332, lng: -8.6118 }
    ],
    elevationProfile: [0.15, 0.15, 0.2, 0.15, 0.1]
  }
];

export function getTourById(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
