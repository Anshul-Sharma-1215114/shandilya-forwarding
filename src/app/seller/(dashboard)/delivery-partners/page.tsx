import { MapPin } from "lucide-react";
import { sellerFetch } from "@/lib/seller-session";
import type { DeliveryPartner } from "@/lib/seller-types";
import AllPartnersMapLoader from "./AllPartnersMapLoader";
import DeliveryPartnersTable from "./DeliveryPartnersTable";

export default async function DeliveryPartnersPage() {
  const { partners } = await sellerFetch<{ partners: DeliveryPartner[] }>("/api/delivery-partners");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Delivery Partners</h1>
        <p className="text-sm text-ink-500">
          {partners.length} registered. Customers never self-register as delivery partners - add
          them here with their phone number, and they can sign in with that number right away.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-ink-400" strokeWidth={2} />
          <h2 className="text-sm font-bold text-ink-900">Live Locations</h2>
        </div>
        <AllPartnersMapLoader initialPartners={partners} />
      </div>

      <DeliveryPartnersTable partners={partners} />
    </div>
  );
}
