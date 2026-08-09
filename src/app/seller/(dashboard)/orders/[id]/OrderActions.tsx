"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, ChevronDown } from "lucide-react";
import type { DeliveryPartner, Order, OrderStatus } from "@/lib/seller-types";
import { cn } from "@/lib/utils";
import { assignDeliveryPartner, updateOrderStatus } from "./actions";

// Mirrors SELLER_TRANSITIONS in apps/backend/src/routes/orders.ts exactly -
// the backend is the real authority (this just avoids offering a button
// that would 400).
const SELLER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["packed", "cancelled"],
  packed: ["ready_for_pickup", "cancelled"],
  ready_for_pickup: ["cancelled"],
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Payment Pending",
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  packed: "Packed",
  ready_for_pickup: "Ready for Pickup",
  accepted: "Accepted",
  picked_up: "Picked Up",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_payment: "bg-ink-100 text-ink-600",
  placed: "bg-secondary-100 text-secondary-700",
  confirmed: "bg-secondary-100 text-secondary-700",
  preparing: "bg-secondary-100 text-secondary-700",
  packed: "bg-secondary-100 text-secondary-700",
  ready_for_pickup: "bg-blue-100 text-blue-700",
  accepted: "bg-blue-100 text-blue-700",
  picked_up: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-primary-100 text-primary-700",
  cancelled: "bg-accent-100 text-accent-700",
};

export default function OrderActions({
  order,
  partners,
}: {
  order: Order;
  partners: DeliveryPartner[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState(order.deliveryPartnerId ?? "");

  const nextStatuses = SELLER_TRANSITIONS[order.status] ?? [];

  async function handleStatusChange(next: OrderStatus) {
    setError(null);
    setBusy(true);
    const result = await updateOrderStatus(order.id, next);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleAssign() {
    if (!selectedPartner) return;
    setError(null);
    setBusy(true);
    const result = await assignDeliveryPartner(order.id, selectedPartner);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-surface p-5 card-elevated">
      <span
        className={cn(
          "w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
          STATUS_STYLE[order.status]
        )}
      >
        {STATUS_LABEL[order.status]}
      </span>

      {nextStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => void handleStatusChange(s)}
              className={
                s === "cancelled"
                  ? "rounded-full border border-accent-200 px-4 py-2 text-sm font-semibold text-accent-600 transition-colors hover:bg-accent-50 disabled:opacity-50"
                  : "rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
              }
            >
              {s === "cancelled" ? "Cancel Order" : `Mark ${STATUS_LABEL[s]}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-900/6 pt-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Bike className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </div>
        <div className="relative">
          <select
            id="delivery-partner"
            className="appearance-none rounded-lg border border-ink-900/12 bg-surface py-2 pl-3 pr-8 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-primary-500"
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
          >
            <option value="">Unassigned</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        </div>
        <button
          disabled={busy || !selectedPartner || selectedPartner === order.deliveryPartnerId}
          onClick={() => void handleAssign()}
          className="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50"
        >
          {order.deliveryPartnerId ? "Reassign" : "Assign"}
        </button>
      </div>

      {error && <p className="text-sm font-medium text-accent-600">{error}</p>}
    </div>
  );
}
