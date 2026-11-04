#!/usr/bin/env node
/**
 * Converts real ridden GPX tracks into the precomputed route data the app
 * ships: a thinned track polyline, cumulative distances along it, and a
 * turn-by-turn maneuver list (bearing-change detection over a simplified
 * version of the track). All of this runs once, offline, at build time —
 * the app never re-derives it on-device.
 *
 * Usage:
 *   1. Drop a real ridden GPX file into assets/gpx/<tourId>.gpx, named to
 *      match a tour id in src/data/tours.ts exactly (e.g.
 *      assets/gpx/coastal-way-santiago.gpx).
 *   2. node scripts/gpx-to-track.mjs
 *   3. Commit the resulting src/data/tracks/<tourId>.json.
 *
 * Tours without a GPX file keep their placeholder `null` track and fall
 * back to the straight-line stop-to-stop cue sheet in the app.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GPX_DIR = join(__dirname, '..', 'assets', 'gpx');
const OUT_DIR = join(__dirname, '..', 'src', 'data', 'tracks');

const EARTH_RADIUS_M = 6371000;
const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

function bearing(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function normalizeDelta(deg) {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/** Minimal <trkpt lat="" lon=""> extractor — handles the standard track
 *  output of Garmin Connect, Strava, Komoot, and RideWithGPS exports.
 *  Not a full GPX/XML parser by design: those exports are consistent
 *  enough that a regex is far simpler than pulling in an XML dependency
 *  for a build-time script that runs once per file. */
function parseGpx(xml) {
  const points = [];
  // Match the whole <trkpt ...>...</trkpt> element so we can pull <ele> out of
  // its body; attribute order (lat/lon vs lon/lat) varies by exporter.
  const re = /<trkpt\s+([^>]*?)\s*(?:\/>|>([\s\S]*?)<\/trkpt>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const lat = /lat="(-?\d+(?:\.\d+)?)"/.exec(m[1]);
    const lon = /lon="(-?\d+(?:\.\d+)?)"/.exec(m[1]);
    if (!lat || !lon) continue;
    const ele = m[2] ? /<ele>\s*(-?\d+(?:\.\d+)?)\s*<\/ele>/.exec(m[2]) : null;
    points.push({ lat: parseFloat(lat[1]), lng: parseFloat(lon[1]), ele: ele ? parseFloat(ele[1]) : null });
  }
  return points;
}

/** Bucket width for the shipped elevation profile. */
const PROFILE_STEP_M = 250;
/** Smoothing window for ascent/descent — barometric/GPS altitude jitters by
 *  a metre or two per fix; summing raw deltas over 10k points would report
 *  thousands of metres of phantom climbing. */
const ELE_SMOOTH_M = 100;

/** Per-PROFILE_STEP_M elevation samples plus ascent/descent/min/max, or null
 *  if the file carries no <ele> data. */
function buildElevation(points, cumDist) {
  const withEle = points.filter((p) => p.ele !== null);
  if (withEle.length < points.length * 0.9) return null;

  // Interpolate elevation at fixed distance steps along the track.
  const total = cumDist[cumDist.length - 1];
  const samples = [];
  let j = 0;
  for (let d = 0; d <= total; d += PROFILE_STEP_M) {
    while (j < points.length - 2 && cumDist[j + 1] < d) j++;
    const a = points[j];
    const b = points[Math.min(j + 1, points.length - 1)];
    const span = cumDist[j + 1] - cumDist[j] || 1;
    const t = Math.max(0, Math.min(1, (d - cumDist[j]) / span));
    const ea = a.ele ?? b.ele ?? 0;
    const eb = b.ele ?? ea;
    samples.push(Math.round(ea + (eb - ea) * t));
  }

  // Ascent/descent from a distance-smoothed series, so sensor noise doesn't
  // count as climbing. Window = ELE_SMOOTH_M each side.
  const w = Math.max(1, Math.round(ELE_SMOOTH_M / PROFILE_STEP_M));
  const smooth = samples.map((_, i) => {
    const lo = Math.max(0, i - w);
    const hi = Math.min(samples.length - 1, i + w);
    let s = 0;
    for (let k = lo; k <= hi; k++) s += samples[k];
    return s / (hi - lo + 1);
  });
  let ascentM = 0;
  let descentM = 0;
  for (let i = 1; i < smooth.length; i++) {
    const delta = smooth[i] - smooth[i - 1];
    if (delta > 0) ascentM += delta;
    else descentM -= delta;
  }

  return {
    stepM: PROFILE_STEP_M,
    samples,
    minM: Math.min(...samples),
    maxM: Math.max(...samples),
    ascentM: Math.round(ascentM),
    descentM: Math.round(descentM),
  };
}

/** Ramer–Douglas–Peucker simplification. Perpendicular distance is measured
 *  in metres via a local equirectangular projection — an approximation,
 *  but a fine one at the scale of a single day's ride. Returns the kept
 *  indices into the original `points` array. */
function simplify(points, toleranceM) {
  if (points.length < 3) return points.map((_, i) => i);
  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  const lat0 = toRad(points[Math.floor(points.length / 2)].lat);
  const project = (p) => ({
    x: toRad(p.lng) * Math.cos(lat0) * EARTH_RADIUS_M,
    y: toRad(p.lat) * EARTH_RADIUS_M,
  });
  const proj = points.map(project);

  function perpDist(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    const cx = a.x + Math.max(0, Math.min(1, t)) * dx;
    const cy = a.y + Math.max(0, Math.min(1, t)) * dy;
    return Math.hypot(p.x - cx, p.y - cy);
  }

  function recurse(lo, hi) {
    let maxDist = 0;
    let idx = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = perpDist(proj[i], proj[lo], proj[hi]);
      if (d > maxDist) {
        maxDist = d;
        idx = i;
      }
    }
    if (maxDist > toleranceM && idx !== -1) {
      keep[idx] = true;
      recurse(lo, idx);
      recurse(idx, hi);
    }
  }
  recurse(0, points.length - 1);

  const indices = [];
  keep.forEach((k, i) => k && indices.push(i));
  return indices;
}

/** Below this angle, treat direction change as noise, not a maneuver worth announcing. */
const TURN_ANGLE_THRESHOLD_DEG = 20;
/** Two candidate maneuvers closer together than this are almost always the
 *  same real-world junction seen twice by the simplifier (or GPS wobble
 *  approaching it) — keep only the sharper one. */
const MANEUVER_MERGE_WINDOW_M = 150;

function classifyTurn(deltaDeg) {
  const abs = Math.abs(deltaDeg);
  const dir = deltaDeg < 0 ? 'left' : 'right';
  if (abs < TURN_ANGLE_THRESHOLD_DEG) return null;
  if (abs < 50) return { turn: `slight-${dir}`, instruction: `Bear ${dir}` };
  if (abs < 130) return { turn: dir, instruction: `Turn ${dir}` };
  return { turn: 'u-turn', instruction: 'Turn around' };
}

/** Drops consecutive points closer together than `minMoveM` — GPS wobble
 *  while stationary (a rest stop, a photo, a junction wait) otherwise
 *  injects noisy, near-random bearings into maneuver detection and
 *  slightly inflates total distance. */
function dropStationaryJitter(points, minMoveM = 3) {
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (haversine(out[out.length - 1], points[i]) >= minMoveM) out.push(points[i]);
  }
  return out;
}

function buildTrack(rawPoints) {
  const points = dropStationaryJitter(rawPoints);

  const cumDist = [0];
  for (let i = 1; i < points.length; i++) {
    cumDist.push(cumDist[i - 1] + haversine(points[i - 1], points[i]));
  }
  const totalDistanceM = cumDist[cumDist.length - 1];

  // Coarse simplification finds the vertices where the route actually
  // changes direction — that's where maneuver candidates come from. The
  // tolerance is deliberately generous (30m): a raw GPS track has constant
  // minor curvature (road camber, lane drift, sensor noise) that isn't a
  // maneuver a rider would recognize as an instruction.
  const maneuverIdx = simplify(points, 30);
  const candidates = [];
  for (let s = 1; s < maneuverIdx.length - 1; s++) {
    const prevIdx = maneuverIdx[s - 1];
    const curIdx = maneuverIdx[s];
    const nextIdx = maneuverIdx[s + 1];
    const bearingIn = bearing(points[prevIdx], points[curIdx]);
    const bearingOut = bearing(points[curIdx], points[nextIdx]);
    const delta = normalizeDelta(bearingOut - bearingIn);
    if (Math.abs(delta) < TURN_ANGLE_THRESHOLD_DEG) continue;
    candidates.push({ atIndex: curIdx, distanceFromStartM: cumDist[curIdx], delta });
  }

  // Merge candidates that fall within the same real-world junction.
  const merged = [];
  for (const c of candidates) {
    const last = merged[merged.length - 1];
    if (last && c.distanceFromStartM - last.distanceFromStartM < MANEUVER_MERGE_WINDOW_M) {
      if (Math.abs(c.delta) > Math.abs(last.delta)) merged[merged.length - 1] = c;
    } else {
      merged.push(c);
    }
  }

  const maneuvers = merged.map((c) => ({
    // The maneuver's actual coordinate, not a raw array index — `atIndex`
    // indexes into `points` (this function's dense working array), which
    // is NOT the same array as the shipped, separately-thinned `track`,
    // so an index here would silently point at the wrong place.
    at: [Math.round(points[c.atIndex].lat * 1e6) / 1e6, Math.round(points[c.atIndex].lng * 1e6) / 1e6],
    distanceFromStartM: Math.round(c.distanceFromStartM),
    ...classifyTurn(c.delta),
  }));

  // Finer simplification for the shipped polyline/snap-to-route track —
  // dense enough to match GPS accurately, thin enough to keep bundle size
  // and on-device matching cheap.
  const trackIdx = simplify(points, 8);
  const track = trackIdx.map((i) => [Math.round(points[i].lat * 1e6) / 1e6, Math.round(points[i].lng * 1e6) / 1e6]);
  const trackCumDist = trackIdx.map((i) => Math.round(cumDist[i]));

  const elevation = buildElevation(points, cumDist);

  return { totalDistanceM: Math.round(totalDistanceM), track, trackCumDist, maneuvers, elevation };
}

function main() {
  if (!existsSync(GPX_DIR)) {
    console.log(`No ${GPX_DIR} — nothing to convert yet. See README "Real GPX tracks".`);
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(GPX_DIR).filter((f) => f.endsWith('.gpx'));
  if (files.length === 0) {
    console.log(`No .gpx files in ${GPX_DIR} yet.`);
    return;
  }

  for (const file of files) {
    const tourId = basename(file, '.gpx');
    const outPath = join(OUT_DIR, `${tourId}.json`);
    if (!existsSync(outPath)) {
      console.warn(`⚠️  ${file}: "${tourId}" doesn't match any id in src/data/tours.ts — skipping.`);
      continue;
    }
    const xml = readFileSync(join(GPX_DIR, file), 'utf8');
    const points = parseGpx(xml);
    if (points.length < 2) {
      console.warn(`⚠️  ${file}: found ${points.length} track points (expected <trkpt lat lon>), skipping.`);
      continue;
    }
    const result = buildTrack(points);
    writeFileSync(outPath, JSON.stringify(result));
    console.log(
      `✓ ${tourId}: ${points.length} raw points → ${result.track.length} shipped, ${result.maneuvers.length} maneuvers, ${(result.totalDistanceM / 1000).toFixed(1)} km, ${result.elevation ? `+${result.elevation.ascentM} m / -${result.elevation.descentM} m` : 'no <ele> data'}`
    );
  }
}

main();
