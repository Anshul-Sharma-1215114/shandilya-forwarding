"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { io, type Socket } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { getDeliveryLocation, getTrackingTicket } from "./actions";
import { computeBearing, type LatLng } from "@/lib/bearing";
import { distanceToPolylineMeters, ROUTE_DEVIATION_THRESHOLD_M } from "@/lib/route-deviation";
import { TILE_ATTRIBUTION, TILE_URL_TEMPLATE } from "@/lib/tiles";

const POLL_INTERVAL_MS = 15000;
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

// OSRM's free public demo routing server - no API key, same free/open-source
// spirit as the OpenStreetMap tiles already used here. Fine at this
// business's scale; swap for a self-hosted OSRM instance if volume ever
// makes the shared demo server unreliable.
const OSRM_URL = "https://router.project-osrm.org";

// Small delivery-truck badge, matching the same inline-SVG-divIcon approach
// used everywhere else on this map (and mirrored in the mobile app's
// LiveLocationMap.tsx) - nothing here is an external image asset that could
// fail to load, which is the simplest possible fallback story. Drawn
// nose-up (north) at 0deg so rotating it by a compass bearing (0=N,
// clockwise) via CSS `rotate()` lines up correctly.
const TRUCK_ICON_HTML = `<div style="width:30px;height:30px;border-radius:9px;background:white;border:2px solid #1b4f9c;box-shadow:0 1px 4px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
  <div class="truck-rotate" style="transition:transform 0.3s ease;width:20px;height:20px;">
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect x="7" y="10" width="10" height="10" rx="1.5" fill="#1b4f9c"/>
      <path d="M9 4 L15 4 L17 10 L7 10 Z" fill="#1b4f9c"/>
      <rect x="10" y="5.4" width="4" height="3.2" rx="0.6" fill="white" opacity="0.85"/>
      <circle cx="9.3" cy="20" r="1.6" fill="#1b4f9c"/>
      <circle cx="14.7" cy="20" r="1.6" fill="#1b4f9c"/>
    </svg>
  </div>
</div>`;

const partnerIcon = L.divIcon({
  className: "",
  html: TRUCK_ICON_HTML,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:4px;background:#c81e34;border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  // Rounded to the same ~200m precision as the route-refetch effect below -
  // GPS jitter alone shifts the raw coordinates on nearly every update,
  // which was re-triggering a full fitBounds pan/zoom (and new tile
  // requests) every single tick regardless of whether the partner actually
  // moved, fighting any manual pan/zoom the seller was doing.
  const key = points.map((p) => p.map((n) => Math.round(n * 500)).join(",")).join("|");
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [30, 30] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

/** Rotates the truck marker's inner glyph without touching Leaflet's own positioning transform on the outer element. */
function RotatedTruckMarker({ position, bearing }: { position: [number, number]; bearing: number | null }) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (bearing == null) return;
    const el = markerRef.current?.getElement();
    const inner = el?.querySelector<HTMLElement>(".truck-rotate");
    if (inner) inner.style.transform = `rotate(${bearing}deg)`;
  }, [bearing]);

  return <Marker ref={markerRef} position={position} icon={partnerIcon} zIndexOffset={1000} />;
}

async function fetchRoute(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const url = `${OSRM_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const route = data?.routes?.[0];
  const coords = route?.geometry?.coordinates as [number, number][] | undefined;
  if (!coords) return null;
  return {
    coords: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
    distanceKm: (route.distance as number) / 1000,
    durationMin: (route.duration as number) / 60,
  };
}

export default function DeliveryTrackingMap({
  orderId,
  destLat,
  destLng,
}: {
  orderId: string;
  destLat?: number | null;
  destLng?: number | null;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [routeUnavailable, setRouteUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState<"delivered" | "cancelled" | null>(null);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "reconnecting">("connecting");
  const mountedRef = useRef(true);
  const previousPositionRef = useRef<LatLng | null>(null);
  const lastRouteRef = useRef<LatLng[] | null>(null);
  const hasDest = destLat != null && destLng != null;

  function applyPosition(next: { lat: number; lng: number }, nextUpdatedAt: string, incomingHeading?: number | null) {
    const nextBearing =
      incomingHeading ?? (previousPositionRef.current ? computeBearing(previousPositionRef.current, next) : null);
    previousPositionRef.current = next;
    setPosition(next);
    setUpdatedAt(nextUpdatedAt);
    if (nextBearing != null) setBearing(nextBearing);
  }

  // Reconciliation poll - kept running alongside the live socket below.
  // Sockets drop silently often enough in the field (backgrounding, flaky
  // connections) that this cheap fallback is worth keeping rather than
  // trusting push updates alone.
  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      if (document.hidden) return;
      const result = await getDeliveryLocation(orderId);
      if (!mountedRef.current) return;
      if (result.error) {
        setError(result.error);
        return;
      }
      const { lat, lng, updatedAt: at } = result.location!;
      if (lat !== null && lng !== null) applyPosition({ lat, lng }, at!);
    }

    void poll();
    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS);
    function onVisibilityChange() {
      if (!document.hidden) void poll();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Live socket connection - the primary update path. Auth uses a fresh
  // short-lived tracking ticket on every (re)connection attempt, not a
  // static one fetched once at mount, since a real delivery can easily
  // outlast the ticket's TTL across a reconnect (see useOrderTracking.ts on
  // mobile for the same pattern).
  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: (cb) => {
        getTrackingTicket(orderId).then((result) => cb({ token: result.token ?? "" }));
      },
    });

    socket.on("connect", () => setConnectionState("connected"));
    socket.io.on("reconnect_attempt", () => setConnectionState("reconnecting"));

    socket.on(
      "location:update",
      (event: { orderId: string; lat: number; lng: number; heading: number | null; updatedAt: string }) => {
        if (event.orderId !== orderId) return;
        applyPosition({ lat: event.lat, lng: event.lng }, event.updatedAt, event.heading);
      }
    );

    socket.on("tracking:ended", (event: { orderId: string; status: "delivered" | "cancelled" }) => {
      if (event.orderId !== orderId) return;
      setEnded(event.status);
      socket.disconnect();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Real deviation check, not just "moved to a new ~200m grid cell" (the
  // rounded values below are the cheap pre-filter, so GPS jitter alone
  // never even reaches this calculation).
  const roundedLat = position ? Math.round(position.lat * 500) : null;
  const roundedLng = position ? Math.round(position.lng * 500) : null;
  useEffect(() => {
    if (!position || !hasDest) return;
    const deviated =
      !lastRouteRef.current ||
      distanceToPolylineMeters(position, lastRouteRef.current) > ROUTE_DEVIATION_THRESHOLD_M;
    if (!deviated) return;

    let cancelled = false;
    fetchRoute(position.lat, position.lng, destLat!, destLng!).then((result) => {
      if (cancelled) return;
      if (!result) {
        setRouteUnavailable(true);
        return;
      }
      setRouteUnavailable(false);
      lastRouteRef.current = result.coords.map(([lat, lng]) => ({ lat, lng }));
      setRoute(result.coords);
      setRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedLat, roundedLng, hasDest, destLat, destLng]);

  if (ended) {
    return (
      <p
        className={`rounded-2xl px-4 py-6 text-center text-sm font-semibold card-elevated-sm ${
          ended === "delivered" ? "bg-primary-50 text-primary-700" : "bg-accent-50 text-accent-600"
        }`}
      >
        {ended === "delivered" ? "This order has been delivered." : "This delivery was cancelled."}
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!position) {
    return (
      <p className="rounded-2xl bg-cream-dim px-4 py-6 text-center text-sm text-ink-500 card-elevated-sm">
        Waiting for the delivery partner&apos;s location...
      </p>
    );
  }

  const boundsPoints: [number, number][] = hasDest ? [[position.lat, position.lng], [destLat!, destLng!]] : [];

  return (
    <div className="overflow-hidden rounded-2xl card-elevated-sm">
      <div className="relative">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: 280, width: "100%" }}
        >
          <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL_TEMPLATE} />
          <RotatedTruckMarker position={[position.lat, position.lng]} bearing={bearing} />
          {hasDest && <Marker position={[destLat!, destLng!]} icon={destIcon} />}
          {route && (
            <Polyline positions={route} pathOptions={{ color: "#1b4f9c", weight: 4, opacity: 0.8 }} />
          )}
          {hasDest ? <FitBounds points={boundsPoints} /> : <Recenter lat={position.lat} lng={position.lng} />}
        </MapContainer>

        {/* Bottom-left / top-right, not top-left - Leaflet's own zoom
            control sits top-left with a high internal z-index that would
            otherwise cover an overlay placed there. */}
        <div className="absolute bottom-2.5 left-2.5 z-[1000] flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connectionState === "connected" ? "bg-primary-600" : "bg-secondary-500"
            }`}
          />
          {connectionState === "connected" ? "Live" : "Reconnecting..."}
        </div>
        {routeInfo && (
          <div className="absolute right-2.5 top-2.5 z-[1000] rounded-full bg-primary-700/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {Math.max(1, Math.round(routeInfo.durationMin))} min &middot; {routeInfo.distanceKm.toFixed(1)} km
          </div>
        )}
        {routeUnavailable && hasDest && (
          <div className="absolute bottom-2.5 right-2.5 z-[1000] rounded-full bg-ink-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            Route unavailable
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-ink-900/8 bg-surface px-3 py-1.5 text-xs text-ink-400">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary-600" /> Delivery partner
        </span>
        {hasDest && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-accent-600" /> Customer
          </span>
        )}
        {updatedAt && <span>Updated {new Date(updatedAt).toLocaleTimeString("en-IN")}</span>}
      </div>
    </div>
  );
}
