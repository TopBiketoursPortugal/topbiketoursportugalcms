import { Camera, type CameraRef, GeoJSONSource, Layer, Map, Marker, UserLocation } from '@maplibre/maplibre-react-native';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { NavHud } from '@/components/NavHud';
import { OffRouteCard, type RecomputeStatus } from '@/components/OffRouteCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TurnByTurnCue } from '@/components/TurnByTurnCue';
import { WazeBanner } from '@/components/WazeBanner';
import { getTrack } from '@/data/tracks';
import { fetchCyclingRoute } from '@/lib/directions';
import { openInGoogleMaps, openInWaze } from '@/lib/externalNav';
import { distanceMeters, nextWaypointIndex } from '@/lib/geo';
import {
  boundsForWaypoints,
  deleteTourOfflinePack,
  downloadTourOfflinePack,
  findTourOfflinePack,
} from '@/lib/offlineMap';
import { hasMapStyle, MAP_STYLE_URL } from '@/lib/mapStyle';
import { nextManeuver, OFF_ROUTE_THRESHOLD_M, type PrecomputedTrack, snapToTrack } from '@/lib/routeTrack';
import { CHASE_PITCH, CHASE_ZOOM, useChaseCamera } from '@/lib/useChaseCamera';
import { useLiveLocation } from '@/lib/useLiveLocation';
import { say, useVoiceGuidance } from '@/lib/useVoiceGuidance';
import { useMyTour } from '@/lib/useMyTour';
import { useTheme } from '@/theme/ThemeProvider';

type PackState = 'checking' | 'none' | 'downloading' | 'downloaded';

export default function RouteScreen() {
  const { colors, spacing, fonts } = useTheme();
  const mine = useMyTour();

  const [navigating, setNavigating] = useState(false);
  const { position, permission } = useLiveLocation(navigating);
  const cameraRef = useRef<CameraRef>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Waze-style "chase" camera (src/lib/useChaseCamera.ts): street-level
  // zoom, tilted so the road ahead stretches up the screen, rotating with
  // the direction of travel. The large top padding keeps the puck clear of
  // the banner and in the lower part of the screen so most of the map shows
  // what's coming, not what's passed. `following` flips to false the moment
  // the rider pans/pinches, at which point a Re-center pill appears — same
  // behaviour as Waze/Google Maps.
  const [following, setFollowing] = useState(true);
  const chasePadding = useMemo(
    () => ({ top: insets.top + 180, right: 0, bottom: insets.bottom + 190, left: 0 }),
    [insets.top, insets.bottom]
  );
  useChaseCamera(cameraRef, position, navigating && following, chasePadding);

  // Hide the tab bar while navigating so the map is truly full-screen.
  useEffect(() => {
    navigation.setOptions({ tabBarStyle: navigating ? { display: 'none' } : undefined });
  }, [navigating, navigation]);

  const [packState, setPackState] = useState<PackState>('checking');
  const [progress, setProgress] = useState(0);

  // A live-recomputed route (src/lib/directions.ts), only ever set by the
  // rider tapping "Recompute" on OffRouteCard — see handleRecompute.
  const [detour, setDetour] = useState<PrecomputedTrack | null>(null);
  const [recomputeStatus, setRecomputeStatus] = useState<RecomputeStatus>('idle');
  const [recomputeError, setRecomputeError] = useState<string | null>(null);
  // Bumped on every applied recompute so voice guidance can announce it once.
  const [detourVersion, setDetourVersion] = useState(0);

  const [voiceOn, setVoiceOn] = useState(true);

  const tourId = mine?.tour.id;

  useEffect(() => {
    if (!tourId || !hasMapStyle()) {
      setPackState('none');
      return;
    }
    let cancelled = false;
    findTourOfflinePack(tourId).then((pack) => {
      if (!cancelled) setPackState(pack ? 'downloaded' : 'none');
    });
    return () => {
      cancelled = true;
    };
  }, [tourId]);

  if (!mine) return null;
  const { tour } = mine;

  // A real ridden GPX (precomputed by scripts/gpx-to-track.mjs) if one has
  // been imported for this tour — otherwise every street-level feature
  // below falls back to the straight-line stop-to-stop cue sheet.
  const track = tourId ? getTrack(tourId) : null;

  const bounds = useMemo(() => boundsForWaypoints(tour.waypoints), [tour]);
  const lineGeometry = useMemo(() => {
    if (track) {
      return { type: 'LineString' as const, coordinates: track.track.map(([lat, lng]) => [lng, lat] as [number, number]) };
    }
    return { type: 'LineString' as const, coordinates: tour.waypoints.map((w) => [w.lng, w.lat] as [number, number]) };
  }, [track, tour]);

  const liveLatLng = position ? { lat: position.coords.latitude, lng: position.coords.longitude } : null;

  // Always snapped against the ORIGINAL planned track — this is what
  // detects "off route" and what a detour is measured against to know
  // when the rider has rejoined the plan.
  const snap = useMemo(() => (track && liveLatLng ? snapToTrack(liveLatLng, track) : null), [track, liveLatLng]);
  const isOffRoute = !detour && !!snap && snap.offRouteM > OFF_ROUTE_THRESHOLD_M;

  // Whichever track is actually driving the turn-by-turn banner right now.
  const activeTrack = detour ?? track;
  const activeSnap = useMemo(
    () => (activeTrack && liveLatLng ? snapToTrack(liveLatLng, activeTrack) : null),
    [activeTrack, liveLatLng]
  );
  const maneuver = activeTrack && activeSnap ? nextManeuver(activeTrack, activeSnap.progressDistanceM) : null;
  const distanceToManeuverM =
    maneuver && activeSnap ? Math.max(0, maneuver.distanceFromStartM - activeSnap.progressDistanceM) : null;
  const finished = !!activeTrack && !!activeSnap && activeTrack.totalDistanceM - activeSnap.progressDistanceM < 30;

  useVoiceGuidance({
    enabled: navigating && voiceOn && !!track,
    maneuver,
    distanceToManeuverM,
    offRoute: isOffRoute,
    detourVersion,
    finished,
  });

  // Once the rider is back within range of the planned route, the detour
  // has done its job — drop it and resume normal navigation.
  useEffect(() => {
    if (detour && snap && snap.offRouteM <= OFF_ROUTE_THRESHOLD_M) {
      setDetour(null);
      setRecomputeStatus('idle');
    }
  }, [detour, snap]);

  // Target for "open in Waze/Google Maps" — the next un-reached stop, by
  // straight-line distance. Works even for tours with no imported GPX,
  // since it doesn't depend on `track` at all: the rider's chosen app
  // does its own full road routing from here.
  const externalNavTarget = tour.waypoints[nextWaypointIndex(tour.waypoints, liveLatLng)];

  // HUD elevation: prefer the ridden track's profile at the rider's current
  // progress (barometric-quality, smoothed) over the phone's raw GPS
  // altitude, which can be off by tens of metres.
  const hudElevationM = (() => {
    if (activeTrack?.elevation && activeSnap) {
      const { samples, stepM } = activeTrack.elevation;
      const i = Math.min(samples.length - 1, Math.round(activeSnap.progressDistanceM / stepM));
      return samples[i];
    }
    return position?.coords.altitude ?? null;
  })();
  const distanceToWaypointM = liveLatLng ? distanceMeters(liveLatLng, externalNavTarget) : null;

  async function handleDownload() {
    if (!MAP_STYLE_URL || !tourId) return;
    setPackState('downloading');
    setProgress(0);
    try {
      await downloadTourOfflinePack(tourId, bounds, MAP_STYLE_URL, setProgress);
      setPackState('downloaded');
    } catch (err) {
      console.warn('[Rota] offline download failed:', err);
      setPackState('none');
    }
  }

  async function handleDelete() {
    if (!tourId) return;
    await deleteTourOfflinePack(tourId);
    setPackState('none');
  }

  function handleStart() {
    setNavigating(true);
    setFollowing(true);
    if (voiceOn && track) say('Starting navigation. Follow the route.');
  }

  function handleEnd() {
    setNavigating(false);
    setDetour(null);
    setRecomputeStatus('idle');
    setRecomputeError(null);
    cameraRef.current?.setStop({ pitch: 0, bearing: 0, bounds, padding: { top: 40, right: 40, bottom: 40, left: 40 }, duration: 800, easing: 'fly' });
  }

  function handleRecenter() {
    setFollowing(true);
    // Snap back now rather than waiting for the next GPS fix; useChaseCamera
    // takes over (with the right bearing) from the following fix onward.
    if (liveLatLng) {
      cameraRef.current?.easeTo({ center: [liveLatLng.lng, liveLatLng.lat], zoom: CHASE_ZOOM, pitch: CHASE_PITCH, padding: chasePadding, duration: 500 });
    }
  }

  async function handleRecompute() {
    if (!liveLatLng || !track) return;
    setRecomputeStatus('loading');
    setRecomputeError(null);

    // Route back to wherever the rider was headed on the plan — the next
    // maneuver ahead of where they left it, or the final stop if there
    // isn't one.
    const originalNext = snap ? nextManeuver(track, snap.progressDistanceM) : null;
    const target = originalNext?.at
      ? { lat: originalNext.at[0], lng: originalNext.at[1] }
      : tour.waypoints[tour.waypoints.length - 1];

    const result = await fetchCyclingRoute(liveLatLng, target);
    if (result.ok) {
      setDetour(result.route);
      setDetourVersion((v) => v + 1);
      setRecomputeStatus('idle');
    } else {
      setRecomputeStatus('error');
      setRecomputeError(
        result.error === 'no-key'
          ? 'Add EXPO_PUBLIC_ORS_API_KEY to enable live recompute — see .env.example.'
          : result.error === 'no-route'
            ? "Couldn't find a route back from here — try moving closer to a road."
            : "Couldn't reach the routing service — check your connection."
      );
    }
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={navigating ? ['left', 'right'] : ['top', 'left', 'right']}>
      <StatusBar style={navigating ? 'light' : 'auto'} />
      <View style={navigating ? styles.mapAreaFull : styles.mapArea}>
        {hasMapStyle() ? (
          <Map
            style={styles.flex}
            mapStyle={MAP_STYLE_URL as string}
            onRegionWillChange={(e) => {
              // A pan/pinch/rotate by the rider breaks the chase camera;
              // our own easeTo() calls report userInteraction=false.
              if (navigating && following && e.nativeEvent.userInteraction) setFollowing(false);
            }}
          >
            <Camera ref={cameraRef} initialViewState={{ bounds, padding: { top: 40, right: 40, bottom: 40, left: 40 } }} />

            {tour.waypoints.length > 1 && (
              <GeoJSONSource data={lineGeometry}>
                <Layer
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                  paint={{ 'line-color': colors.primary, 'line-width': 4 }}
                />
              </GeoJSONSource>
            )}

            {detour && (
              <GeoJSONSource
                data={{ type: 'LineString', coordinates: detour.track.map(([lat, lng]) => [lng, lat] as [number, number]) }}
              >
                <Layer
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                  paint={{ 'line-color': colors.secondary, 'line-width': 4, 'line-dasharray': [1, 1.5] }}
                />
              </GeoJSONSource>
            )}

            {tour.waypoints.map((wp, i) => (
              <Marker key={`${wp.label}-${i}`} lngLat={[wp.lng, wp.lat]}>
                <View
                  style={[
                    styles.markerDot,
                    {
                      backgroundColor: i === 0 || i === tour.waypoints.length - 1 ? colors.accent : colors.primary,
                      borderColor: colors.surface,
                    },
                  ]}
                />
              </Marker>
            ))}

            {tour.highlightPins?.map((pin) => (
              <Marker key={pin.label} lngLat={[pin.lng, pin.lat]} anchor="bottom">
                <View style={[styles.sightPin, { backgroundColor: colors.info, borderColor: colors.surface }]}>
                  <Text style={styles.sightPinIcon}>★</Text>
                </View>
              </Marker>
            ))}

            <UserLocation accuracy heading />
          </Map>
        ) : (
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.primarySoft }]}>
            <Text style={{ fontSize: 30 }}>🗺️</Text>
            <Text style={{ color: colors.primary, fontFamily: fonts.bodySemiBold, marginTop: 8, textAlign: 'center' }}>
              Add EXPO_PUBLIC_MAP_STYLE_URL (see .env.example) to render the live map{'\n'}and enable offline downloads
            </Text>
          </View>
        )}

        {navigating && (
          <View style={[styles.navOverlay, { paddingTop: insets.top + 10 }]} pointerEvents="box-none">
            <View style={styles.navOverlayCard} pointerEvents="auto">
              {permission === 'denied' && (
                <View style={[styles.overlayNotice, { backgroundColor: colors.surface, borderRadius: 12 }]}>
                  <Text style={{ color: colors.danger, fontFamily: fonts.bodyRegular, fontSize: 12 }}>
                    Location permission denied — enable it in Settings for live navigation.
                  </Text>
                </View>
              )}
              {!track ? (
                <View style={[styles.overlayNotice, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                  <Text style={{ color: colors.muted, fontFamily: fonts.bodyRegular, fontSize: 12, marginBottom: spacing.sm }}>
                    No ridden GPX imported for this tour yet — showing stop-to-stop distance instead of real turns.
                  </Text>
                  <ScrollView style={styles.overlayStopList}>
                    <TurnByTurnCue waypoints={tour.waypoints} position={liveLatLng} />
                  </ScrollView>
                </View>
              ) : isOffRoute ? (
                <OffRouteCard
                  offRouteM={snap?.offRouteM ?? 0}
                  status={recomputeStatus}
                  errorMessage={recomputeError}
                  onRecompute={handleRecompute}
                />
              ) : (
                <WazeBanner
                  maneuver={maneuver}
                  distanceToManeuverM={distanceToManeuverM}
                  totalDistanceM={activeTrack?.totalDistanceM ?? track.totalDistanceM}
                  progressDistanceM={activeSnap?.progressDistanceM ?? 0}
                  detour={!!detour}
                />
              )}
            </View>

            <Pressable
              onPress={handleEnd}
              style={({ pressed }) => [styles.endFab, { top: insets.top + 10, backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={{ fontSize: 18, color: colors.ink }}>✕</Text>
            </Pressable>

            {track && (
              <Pressable
                onPress={() => setVoiceOn((v) => !v)}
                accessibilityLabel={voiceOn ? 'Mute voice guidance' : 'Unmute voice guidance'}
                style={({ pressed }) => [
                  styles.endFab,
                  { top: insets.top + 60, backgroundColor: colors.surface, opacity: pressed ? 0.85 : voiceOn ? 1 : 0.7 },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{voiceOn ? '🔊' : '🔇'}</Text>
              </Pressable>
            )}
          </View>
        )}

        {navigating && !following && (
          <Pressable
            onPress={handleRecenter}
            style={({ pressed }) => [styles.recenterPill, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={{ color: '#fff', fontFamily: fonts.bodySemiBold, fontSize: 14 }}>◎ Re-center</Text>
          </Pressable>
        )}

        {navigating && (
          <View style={[styles.navBottomBar, { paddingBottom: insets.bottom + 14 }]} pointerEvents="box-none">
            <View style={styles.hudWrap} pointerEvents="none">
              <NavHud
                speedMps={position?.coords.speed ?? null}
                elevationM={hudElevationM}
                nextWaypointLabel={externalNavTarget.label}
                distanceToWaypointM={distanceToWaypointM}
              />
            </View>
            <Text style={[styles.navBottomLabel, { color: colors.surface, fontFamily: fonts.bodyRegular }]}>
              Prefer another app?
            </Text>
            <View style={styles.navBottomRow}>
              <Pressable
                onPress={() => openInWaze(externalNavTarget)}
                style={({ pressed }) => [styles.externalNavButton, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>🚗 Open in Waze</Text>
              </Pressable>
              <Pressable
                onPress={() => openInGoogleMaps(externalNavTarget)}
                style={({ pressed }) => [styles.externalNavButton, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>📍 Open in Google Maps</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {!navigating && (
        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl }}>
          <ScreenHeader eyebrow="Route & Map" title={tour.name} />

          <OfflineRow state={packState} progress={progress} onDownload={handleDownload} onDelete={handleDelete} />

          <Text style={[styles.sectionLabel, { color: colors.muted, fontFamily: fonts.bodyBold }]}>ROUTE STOPS</Text>
          <RouteStopPreview waypoints={tour.waypoints} />
          <Button label="Start tour" onPress={handleStart} style={{ marginTop: spacing.lg }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function OfflineRow({
  state,
  progress,
  onDownload,
  onDelete,
}: {
  state: PackState;
  progress: number;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const { colors, radii, spacing, fonts } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold }}>Offline map</Text>
        <Text style={{ color: colors.muted, fontFamily: fonts.bodyRegular, fontSize: 12, marginTop: 2 }}>
          {state === 'checking' && 'Checking…'}
          {state === 'none' && !hasMapStyle() && 'Needs a map style URL — see .env.example'}
          {state === 'none' && hasMapStyle() && 'Not downloaded — works with zero signal once it is'}
          {state === 'downloading' && `Downloading… ${progress}%`}
          {state === 'downloaded' && 'Downloaded — works with zero signal'}
        </Text>
      </View>
      {state === 'downloading' && <ActivityIndicator color={colors.primary} />}
      {state === 'none' && hasMapStyle() && <Button label="Download" variant="secondary" onPress={onDownload} style={{ paddingHorizontal: spacing.lg }} />}
      {state === 'downloaded' && <Button label="Remove" variant="ghost" onPress={onDelete} style={{ paddingHorizontal: spacing.md }} />}
    </View>
  );
}

/** Static, non-live list of stops shown before the rider taps "Start tour". */
function RouteStopPreview({ waypoints }: { waypoints: { label: string }[] }) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.sm }}>
      {waypoints.map((wp, i) => (
        <View key={`${wp.label}-${i}`} style={styles.previewRow}>
          <View style={styles.rail}>
            <View style={[styles.previewDot, { backgroundColor: colors.border }]} />
            {i < waypoints.length - 1 && <View style={[styles.line, { backgroundColor: colors.border }]} />}
          </View>
          <Text style={{ color: colors.text, fontSize: 14, paddingBottom: spacing.md }}>{wp.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  mapArea: { height: '42%', minHeight: 220, position: 'relative' },
  // Full-screen, Waze/Google-Maps-style navigation mode — the map fills
  // everything below the safe area, with the turn-by-turn banner and an
  // End button floating on top of it (navOverlay), instead of the map
  // living in a small preview area above a scrollable page.
  mapAreaFull: { flex: 1, position: 'relative' },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  markerDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 14, marginBottom: 24, gap: 12 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  previewRow: { flexDirection: 'row', gap: 12 },
  rail: { width: 12, alignItems: 'center' },
  previewDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  line: { width: 2, flex: 1, marginTop: 2, minHeight: 14 },
  navOverlay: { position: 'absolute', top: 0, left: 0, right: 0, padding: 14 },
  navOverlayCard: { paddingRight: 52 },
  overlayNotice: { padding: 12, marginBottom: 10 },
  overlayStopList: { maxHeight: 220 },
  endFab: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sightPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sightPinIcon: { color: '#fff', fontSize: 13 },
  navBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, alignItems: 'center' },
  recenterPill: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  navBottomLabel: { fontSize: 11, marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 },
  navBottomRow: { flexDirection: 'row', gap: 10 },
  hudWrap: { alignSelf: 'stretch', marginBottom: 10 },
  externalNavButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
