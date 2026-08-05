"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryPartner, Order, OrderStatus } from "@/lib/seller-types";
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
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-900/8 bg-white p-5">
      <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase text-primary-700">
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
                  ? "rounded-full border border-accent-600 px-4 py-2 text-sm font-semibold text-accent-600 hover:bg-accent-50 disabled:opacity-50"
                  : "rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              }
            >
              {s === "cancelled" ? "Cancel Order" : `Mark ${STATUS_LABEL[s]}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-ink-900/8 pt-4">
        <label className="text-sm font-medium text-ink-700" htmlFor="delivery-partner">
          Delivery Partner
        </label>
        <select
          id="delivery-partner"
          className="rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
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
        <button
          disabled={busy || !selectedPartner || selectedPartner === order.deliveryPartnerId}
          onClick={() => void handleAssign()}
          className="rounded-full border border-primary-600 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 disabled:opacity-50"
        >
          {order.deliveryPartnerId ? "Reassign" : "Assign"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
