import type { PrecomputedTrack } from '@/lib/routeTrack';

// Each of these JSON files starts out `null` — scripts/gpx-to-track.mjs
// overwrites the file for any tour whose real ridden GPX has been dropped
// into assets/gpx/<tourId>.gpx. Metro needs static import paths (it can't
// resolve a dynamic `require(tourId)`), so every known tour id is imported
// explicitly here rather than loaded by a glob.
import coastalWaySantiago from './coastal-way-santiago.json';
import douroFullDay from './douro-full-day.json';
import douroValleyWine from './douro-valley-wine.json';
import frenchWayCamino from './french-way-camino.json';
import northMinho from './north-minho.json';
import portoDowntown from './porto-downtown.json';
import portoFoodWine from './porto-food-wine.json';
import portoLisbonAtlantic from './porto-lisbon-atlantic.json';
import valongoMtb from './valongo-mtb.json';
import vicentineAlgarve from './vicentine-algarve.json';

const TRACKS: Record<string, PrecomputedTrack | null> = {
  'french-way-camino': frenchWayCamino as PrecomputedTrack | null,
  'coastal-way-santiago': coastalWaySantiago as PrecomputedTrack | null,
  'douro-valley-wine': douroValleyWine as PrecomputedTrack | null,
  'porto-lisbon-atlantic': portoLisbonAtlantic as PrecomputedTrack | null,
  'vicentine-algarve': vicentineAlgarve as PrecomputedTrack | null,
  'north-minho': northMinho as PrecomputedTrack | null,
  'douro-full-day': douroFullDay as PrecomputedTrack | null,
  'valongo-mtb': valongoMtb as PrecomputedTrack | null,
  'porto-downtown': portoDowntown as PrecomputedTrack | null,
  'porto-food-wine': portoFoodWine as PrecomputedTrack | null
};

/** The precomputed real-road track for a tour, or null if no GPX has been imported for it yet. */
export function getTrack(tourId: string): PrecomputedTrack | null {
  return TRACKS[tourId] ?? null;
}
