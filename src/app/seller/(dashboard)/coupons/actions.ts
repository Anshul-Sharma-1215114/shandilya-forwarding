"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { Coupon, CouponType } from "@/lib/seller-types";

export type CreateCouponInput = {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderInPaise: number;
  maxDiscountInPaise?: number;
  maxUses?: number;
  perUserLimit?: number;
  active: boolean;
  expiresAt?: string;
};

export async function createCoupon(input: CreateCouponInput) {
  try {
    await sellerFetch<{ coupon: Coupon }>("/api/coupons", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
