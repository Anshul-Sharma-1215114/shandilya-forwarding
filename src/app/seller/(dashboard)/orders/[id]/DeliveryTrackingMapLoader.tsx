"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at module load time, which crashes during SSR -
// next/dynamic's ssr:false is only usable from a Client Component, hence
// this thin wrapper around the actual map (a Server Component can still
// render this wrapper directly, same as any other Client Component).
const DeliveryTrackingMap = dynamic(() => import("./DeliveryTrackingMap"), {
  ssr: false,
  loading: () => (
    <p className="rounded-xl border border-ink-900/8 bg-cream-dim px-4 py-6 text-center text-sm text-ink-500">
      Loading map...
    </p>
  ),
});

export default function DeliveryTrackingMapLoader({
  orderId,
  destLat,
  destLng,
}: {
  orderId: string;
  destLat?: number | null;
  destLng?: number | null;
}) {
  return <DeliveryTrackingMap orderId={orderId} destLat={destLat} destLng={destLng} />;
}
