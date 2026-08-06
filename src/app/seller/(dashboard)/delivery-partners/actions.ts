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
