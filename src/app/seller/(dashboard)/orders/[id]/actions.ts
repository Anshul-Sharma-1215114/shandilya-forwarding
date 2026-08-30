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
 * Polled from DeliveryTrackingMap while an order is picked_up/out_for_delivery,
 * as a reconciliation fallback alongside the live socket connection (see
 * getTrackingTicket below). The browser never calls the backend directly for
 * anything else (see seller-session.ts), so each poll tick is a round trip
 * through this server action instead of a client-side fetch.
 */
export async function getDeliveryLocation(orderId: string) {
  try {
    const location = await sellerFetch<DeliveryLocation>(`/api/orders/${orderId}/delivery-location`);
    return { location };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}

/**
 * A short-lived ticket scoped to one order's live-tracking socket room. This
 * is the one thing the browser fetches through the backend directly (see
 * NEXT_PUBLIC_BACKEND_URL) rather than through a server action for
 * every update - a persistent Socket.IO connection can't be proxied through
 * Next's server the way a request/response round trip can. The ticket keeps
 * the browser from ever needing the real session token to do it.
 */
export async function getTrackingTicket(orderId: string) {
  try {
    const { token } = await sellerFetch<{ token: string }>(`/api/orders/${orderId}/tracking-ticket`);
    return { token };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
