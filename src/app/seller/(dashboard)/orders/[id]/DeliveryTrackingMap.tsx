"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDeliveryLocation } from "./actions";

const POLL_INTERVAL_MS = 15000;

// OSRM's free public demo routing server - no API key, same free/open-source
// spirit as the OpenStreetMap tiles already used here. Fine at this
// business's scale; swap for a self-hosted OSRM instance if volume ever
// makes the shared demo server unreliable.
const OSRM_URL = "https://router.project-osrm.org";

// Leaflet's default marker icon references image assets by relative URL,
// which breaks under bundlers - a divIcon sidesteps that entirely instead
// of wiring up marker-icon.png/marker-shadow.png as static assets.
const partnerIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#1b4f9c;border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:4px;background:#c81e34;border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((p) => p.join(",")).join("|");
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

async function fetchRoute(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const url = `${OSRM_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const coords = data?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
  return coords?.map(([lng, lat]) => [lat, lng] as [number, number]) ?? null;
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
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const hasDest = destLat != null && destLng != null;

  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      const result = await getDeliveryLocation(orderId);
      if (!mountedRef.current) return;
      if (result.error) {
        setError(result.error);
        return;
      }
      const { lat, lng, updatedAt } = result.location!;
      if (lat !== null && lng !== null) {
        setPosition({ lat, lng });
        setUpdatedAt(updatedAt);
      }
    }

    void poll();
    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [orderId]);

  // Re-fetch the route when the partner has moved meaningfully, not on
  // every single poll tick.
  const roundedLat = position ? Math.round(position.lat * 500) : null;
  const roundedLng = position ? Math.round(position.lng * 500) : null;
  useEffect(() => {
    if (!position || !hasDest) return;
    let cancelled = false;
    fetchRoute(position.lat, position.lng, destLat!, destLng!).then((coords) => {
      if (!cancelled) setRoute(coords);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedLat, roundedLng, hasDest, destLat, destLng]);

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
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: 280, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]} icon={partnerIcon} />
        {hasDest && <Marker position={[destLat!, destLng!]} icon={destIcon} />}
        {route && <Polyline positions={route} pathOptions={{ color: "#1b4f9c", weight: 4, opacity: 0.8 }} />}
        {hasDest ? <FitBounds points={boundsPoints} /> : <Recenter lat={position.lat} lng={position.lng} />}
      </MapContainer>
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
