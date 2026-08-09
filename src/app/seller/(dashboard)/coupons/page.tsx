import { sellerFetch } from "@/lib/seller-session";
import type { Coupon } from "@/lib/seller-types";
import CouponsTable from "./CouponsTable";

export default async function SellerCouponsPage() {
  const { coupons } = await sellerFetch<{ coupons: Coupon[] }>("/api/coupons");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Coupons</h1>
        <p className="text-sm text-ink-500">{coupons.length} coupons created</p>
      </div>
      <CouponsTable coupons={coupons} />
    </div>
  );
}
