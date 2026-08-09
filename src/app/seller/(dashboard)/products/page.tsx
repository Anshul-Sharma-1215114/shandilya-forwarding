import { sellerFetch } from "@/lib/seller-session";
import type { Product } from "@/lib/seller-types";
import ProductsTable from "./ProductsTable";

export default async function SellerProductsPage() {
  const { products } = await sellerFetch<{ products: Product[] }>(
    "/api/products?includeInactive=true"
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Products</h1>
        <p className="text-sm text-ink-500">{products.length} products in the catalog</p>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
