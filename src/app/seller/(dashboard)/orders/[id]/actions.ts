"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { Order, OrderStatus } from "@/lib/seller-types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await sellerFetch<{ order: Order }>(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}

export async function assignDeliveryPartner(orderId: string, deliveryPartnerId: string) {
  try {
    await sellerFetch<{ order: Order }>(`/api/orders/${orderId}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ deliveryPartnerId }),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
