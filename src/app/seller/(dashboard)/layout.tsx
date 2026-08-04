import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sellerFetch } from "@/lib/seller-session";
import type { SellerUser } from "@/lib/seller-types";
import Sidebar from "@/components/seller/Sidebar";

export const metadata: Metadata = {
  title: "Seller Portal",
  robots: { index: false, follow: false },
};

/**
 * The actual authority for /seller access - src/proxy.ts only checks that a
 * cookie exists (optimistic edge gate); this re-verifies the token against
 * the backend and the role on every request, per Next's own documented
 * "defense in depth" guidance for Proxy-based auth.
 */
export default async function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  let user: SellerUser;
  try {
    const data = await sellerFetch<{ user: SellerUser }>("/api/auth/me");
    user = data.user;
  } catch {
    redirect("/seller/login");
  }

  if (user.role !== "seller" && user.role !== "admin") {
    redirect("/seller/login");
  }

  return (
    <div className="flex min-h-screen bg-cream-dim">
      <Sidebar userName={user.name} />
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
