import * as Speech from 'expo-speech';
import { useEffect, useRef } from 'react';

import type { Maneuver } from './routeTrack';

/**
 * Distance thresholds at which each maneuver is announced, like Waze /
 * Google Maps: an early heads-up, a reminder, then the "now" call. Tuned
 * for cycling speeds (~15–25 km/h), where 400 m is roughly a minute out.
 */
const ANNOUNCE_AT_M = [400, 150, 30] as const;

function spoken(m: Maneuver): string {
  switch (m.turn) {
    case 'left':
      return 'turn left';
    case 'right':
      return 'turn right';
    case 'slight-left':
      return 'bear left';
    case 'slight-right':
      return 'bear right';
    case 'u-turn':
      return 'make a U-turn';
    case 'straight':
      return 'continue straight';
  }
}

function phrase(m: Maneuver, distanceM: number): string {
  if (distanceM <= ANNOUNCE_AT_M[2]) return `${capitalize(spoken(m))} now`;
  const d =
    distanceM >= 950
      ? `${(distanceM / 1000).toFixed(1)} kilometres`
      : `${Math.round(distanceM / 50) * 50} metres`;
  return `In ${d}, ${spoken(m)}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function say(text: string) {
  Speech.stop();
  Speech.speak(text, { language: 'en-GB', rate: 1.0 });
}

type Options = {
  enabled: boolean;
  maneuver: Maneuver | null;
  distanceToManeuverM: number | null;
  /** Flips when the rider crosses the off-route threshold. */
  offRoute: boolean;
  /** Incremented each time a detour is applied, so "new route" is announced once per recompute. */
  detourVersion: number;
  finished: boolean;
};

/**
 * Spoken turn-by-turn. Each maneuver gets at most one announcement per
 * threshold band, keyed by the maneuver's distance-from-start (its stable
 * identity within a track) — so re-renders and GPS jitter around a
 * threshold never repeat a call, and a new maneuver resets the ladder.
 */
export function useVoiceGuidance({
  enabled,
  maneuver,
  distanceToManeuverM,
  offRoute,
  detourVersion,
  finished
}: Options) {
  const announced = useRef<{ key: number | null; bands: Set<number> }>({
    key: null,
    bands: new Set()
  });
  const wasOffRoute = useRef(false);
  const lastDetourVersion = useRef(detourVersion);
  const saidFinished = useRef(false);

  // Cut any in-flight speech when guidance is switched off or the screen unmounts.
  useEffect(() => {
    if (!enabled) Speech.stop();
    return () => {
      Speech.stop();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || offRoute) return;
    if (finished) {
      if (!saidFinished.current) {
        saidFinished.current = true;
        say('You have reached the end of the route.');
      }
      return;
    }
    if (!maneuver || distanceToManeuverM === null) return;

    const key = maneuver.distanceFromStartM;
    if (announced.current.key !== key) {
      announced.current = { key, bands: new Set() };
    }

    // Highest-priority (closest) band the rider is currently inside of that
    // hasn't been spoken yet. Skipping bands is intentional: if GPS resumes
    // 100 m from a turn, you get "in 100 metres" — not three stacked calls.
    const band = ANNOUNCE_AT_M.find(
      (threshold) => distanceToManeuverM <= threshold
    );
    if (band === undefined || announced.current.bands.has(band)) return;

    // Mark every band at or above this one as used so we never "go back"
    // and announce a farther threshold after a nearer one.
    ANNOUNCE_AT_M.forEach((t) => t >= band && announced.current.bands.add(t));
    say(phrase(maneuver, distanceToManeuverM));
  }, [enabled, maneuver, distanceToManeuverM, offRoute, finished]);

  useEffect(() => {
    if (!enabled) return;
    if (offRoute && !wasOffRoute.current) say('You are off route.');
    wasOffRoute.current = offRoute;
  }, [enabled, offRoute]);

  useEffect(() => {
    if (!enabled) return;
    if (detourVersion !== lastDetourVersion.current) {
      lastDetourVersion.current = detourVersion;
      announced.current = { key: null, bands: new Set() };
      say('New route found. Follow the new directions.');
    }
  }, [enabled, detourVersion]);
}
