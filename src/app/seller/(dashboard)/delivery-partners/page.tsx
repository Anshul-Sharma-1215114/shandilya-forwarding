import { sellerFetch } from "@/lib/seller-session";
import type { DeliveryPartner } from "@/lib/seller-types";
import DeliveryPartnersTable from "./DeliveryPartnersTable";

export default async function DeliveryPartnersPage() {
  const { partners } = await sellerFetch<{ partners: DeliveryPartner[] }>("/api/delivery-partners");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Delivery Partners</h1>
        <p className="text-sm text-ink-500">
          {partners.length} registered. Customers never self-register as delivery partners - add
          them here with their phone number, and they can sign in with that number right away.
        </p>
      </div>
      <DeliveryPartnersTable partners={partners} />
    </div>
  );
}
