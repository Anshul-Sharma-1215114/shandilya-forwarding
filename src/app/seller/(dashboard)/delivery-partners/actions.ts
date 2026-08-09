"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { DeliveryPartner } from "@/lib/seller-types";

export type RegisterDeliveryPartnerInput = {
  phone: string;
  name: string;
  vehicleType: "bike" | "scooter" | "car" | "bicycle";
  vehicleNumber: string;
  emergencyContact: string;
};

export async function registerDeliveryPartner(input: RegisterDeliveryPartnerInput) {
  try {
    await sellerFetch<{ partner: DeliveryPartner }>("/api/delivery-partners", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}

/**
 * Polled from the live map while the delivery-partners page is open. The
 * browser never calls the backend directly (see seller-session.ts), so each
 * poll tick is a round trip through this server action instead of a
 * client-side fetch.
 */
export async function getAllDeliveryPartners() {
  try {
    const { partners } = await sellerFetch<{ partners: DeliveryPartner[] }>("/api/delivery-partners");
    return { partners };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
