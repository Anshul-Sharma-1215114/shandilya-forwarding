import { sellerFetch } from "@/lib/seller-session";
import type { StoreStatus } from "@/lib/seller-types";
import StoreForm from "./StoreForm";

export default async function SellerStorePage() {
  const status = await sellerFetch<StoreStatus>("/api/store/status");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Store Settings</h1>
        <p className="text-sm text-ink-500">Control when customers can place orders.</p>
      </div>
      <StoreForm status={status} />
    </div>
  );
}
