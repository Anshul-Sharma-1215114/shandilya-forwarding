"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { DeliveryLocation, Order, OrderStatus } from "@/lib/seller-types";

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

/**
 * Polled from DeliveryTrackingMap while an order is picked_up/out_for_delivery.
 * The browser never calls the backend directly (see seller-session.ts), so
 * each poll tick is a round trip through this server action instead of a
 * client-side fetch.
 */
export async function getDeliveryLocation(orderId: string) {
  try {
    const location = await sellerFetch<DeliveryLocation>(`/api/orders/${orderId}/delivery-location`);
    return { location };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
