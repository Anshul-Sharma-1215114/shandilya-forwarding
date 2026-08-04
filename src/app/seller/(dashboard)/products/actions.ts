"use server";

import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { Brand, Product } from "@/lib/seller-types";

export type ProductFormInput = {
  slug: string;
  name: string;
  description: string;
  brand: Brand;
  category: string;
  imageUrl?: string;
  priceInPaise: number;
  unit: string;
};

export async function createProduct(input: ProductFormInput) {
  try {
    await sellerFetch<{ product: Product }>("/api/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}

export async function updateProduct(
  id: string,
  input: Partial<ProductFormInput> & { active?: boolean }
) {
  try {
    await sellerFetch<{ product: Product }>(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}

export async function adjustStock(id: string, changeQty: number, reason: string) {
  try {
    await sellerFetch<{ product: Product }>(`/api/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ changeQty, reason }),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof SellerApiError ? err.message : "Something went wrong" };
  }
}
