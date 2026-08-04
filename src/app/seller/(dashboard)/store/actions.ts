"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { StoreStatus } from "@/lib/seller-types";

export type UpdateStoreInput = {
  isManuallyOpen?: boolean | null;
  openTime?: string;
  closeTime?: string;
};

export async function updateStoreStatus(input: UpdateStoreInput) {
  try {
    await sellerFetch<StoreStatus>("/api/store/status", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
