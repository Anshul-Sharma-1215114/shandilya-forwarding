"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDeliveryLocation } from "./actions";

const POLL_INTERVAL_MS = 15000;

// Leaflet's default marker icon references image assets by relative URL,
// which breaks under bundlers - a divIcon sidesteps that entirely instead
// of wiring up marker-icon.png/marker-shadow.png as static assets.
const partnerIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#167f4c;border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function DeliveryTrackingMap({ orderId }: { orderId: string }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

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

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!position) {
    return (
      <p className="rounded-xl border border-ink-900/8 bg-cream-dim px-4 py-6 text-center text-sm text-ink-500">
        Waiting for the delivery partner&apos;s location...
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-900/8">
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
        <Recenter lat={position.lat} lng={position.lng} />
      </MapContainer>
      {updatedAt && (
        <p className="border-t border-ink-900/8 bg-white px-3 py-1.5 text-xs text-ink-400">
          Last updated {new Date(updatedAt).toLocaleTimeString("en-IN")}
        </p>
      )}
    </div>
  );
}
