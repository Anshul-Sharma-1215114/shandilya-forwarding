"use client";

import dynamic from "next/dynamic";
import type { DeliveryPartner } from "@/lib/seller-types";

// Leaflet touches `window` at module load time, which crashes during SSR -
// next/dynamic's ssr:false is only usable from a Client Component, hence
// this thin wrapper around the actual map (a Server Component can still
// render this wrapper directly, same as any other Client Component).
const AllPartnersMap = dynamic(() => import("./AllPartnersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-2xl bg-cream-dim py-16 card-elevated">
      <p className="text-sm text-ink-500">Loading map...</p>
    </div>
  ),
});

export default function AllPartnersMapLoader({ initialPartners }: { initialPartners: DeliveryPartner[] }) {
  return <AllPartnersMap initialPartners={initialPartners} />;
}
