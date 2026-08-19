"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { DeliveryPartner } from "@/lib/seller-types";
import { getAllDeliveryPartners } from "./actions";

const POLL_INTERVAL_MS = 15000;

// Green = available and idle, blue = currently on a delivery, gray = toggled
// off. Same divIcon-over-marker-image approach as DeliveryTrackingMap - a
// bundler-safe way to avoid wiring up Leaflet's default marker png assets.
function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
const AVAILABLE_ICON = pinIcon("#1c8f52");
const BUSY_ICON = pinIcon("#1b4f9c");
const OFFLINE_ICON = pinIcon("#9aa392");

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((p) => p.join(",")).join("|");
  const hasFitRef = useRef(false);
  useEffect(() => {
    if (points.length === 0 || hasFitRef.current) return;
    hasFitRef.current = true;
    if (points.length === 1) {
      map.setView(points[0], 12);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

function iconFor(partner: DeliveryPartner) {
  if (!partner.isAvailable && !partner.activeOrder) return OFFLINE_ICON;
  if (partner.activeOrder) return BUSY_ICON;
  return AVAILABLE_ICON;
}

function statusLabel(partner: DeliveryPartner) {
  if (partner.activeOrder) return `On a delivery · #${partner.activeOrder.id.slice(-8)}`;
  if (partner.isAvailable) return "Available";
  return "Offline";
}

export default function AllPartnersMap({ initialPartners }: { initialPartners: DeliveryPartner[] }) {
  const [partners, setPartners] = useState(initialPartners);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      const result = await getAllDeliveryPartners();
      if (!cancelled && result.partners) setPartners(result.partners);
    }
    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const located = partners.filter(
    (p): p is DeliveryPartner & { lastKnownLat: number; lastKnownLng: number } =>
      p.lastKnownLat != null && p.lastKnownLng != null
  );
  const unlocated = partners.filter((p) => p.lastKnownLat == null || p.lastKnownLng == null);
  const points: [number, number][] = located.map((p) => [p.lastKnownLat, p.lastKnownLng]);

  if (located.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-cream-dim py-16 text-center card-elevated">
        <p className="text-sm font-medium text-ink-500">
          No delivery partner has shared a location yet.
        </p>
        <p className="text-xs text-ink-400">
          A pin appears here once a partner turns Available in their app - not just while they&apos;re
          mid-delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl card-elevated">
      {unlocated.length > 0 && (
        <div className="border-b border-ink-900/8 bg-secondary-50 px-4 py-2 text-xs text-secondary-700">
          {unlocated.length} partner{unlocated.length === 1 ? "" : "s"} not shown here yet -{" "}
          {unlocated.map((p) => p.name).join(", ")} {unlocated.length === 1 ? "hasn't" : "haven't"} shared a
          location (they need to open the app and go Available at least once).
        </div>
      )}
      <MapContainer center={points[0]} zoom={12} scrollWheelZoom style={{ height: 380, width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((p) => (
          <Marker key={p.id} position={[p.lastKnownLat, p.lastKnownLng]} icon={iconFor(p)}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="text-sm font-bold text-ink-900">{p.name}</p>
                <p className="text-xs text-ink-500">{statusLabel(p)}</p>
                {p.locationUpdatedAt && (
                  <p className="mt-1 text-[11px] text-ink-400">
                    Updated {new Date(p.locationUpdatedAt).toLocaleTimeString("en-IN")}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds points={points} />
      </MapContainer>
      <div className="flex flex-wrap items-center gap-4 border-t border-ink-900/8 bg-surface px-4 py-2.5 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1c8f52]" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1b4f9c]" /> On a delivery
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#9aa392]" /> Offline
        </span>
        <span className="ml-auto text-ink-400">Refreshes every 15s</span>
      </div>
    </div>
  );
}
