"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/coupons", label: "Coupons" },
  { href: "/seller/store", label: "Store Settings" },
  { href: "/seller/audit-log", label: "Audit Log" },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  async function handleSignOut() {
    await fetch("/api/seller/session", { method: "DELETE" });
    // Full navigation (not router.replace, which caches the client-side
    // route tree) so the now-cleared cookie is re-evaluated from scratch -
    // replace() followed by a refresh() raced the in-flight transition and
    // could leave the dashboard shell mounted with stale session state.
    window.location.href = "/seller/login";
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between overflow-y-auto border-r border-ink-900/8 bg-white p-5">
      <div>
        <div className="mb-6">
          <p className="font-display text-lg font-bold text-ink-900">Shandilya Forwarding</p>
          <p className="text-xs text-ink-400">Seller Portal</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/seller"
                ? pathname === "/seller" || pathname?.startsWith("/seller/orders")
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary-50 text-primary-700" : "text-ink-600 hover:bg-cream-dim"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-ink-900/8 pt-4">
        <p className="mb-2 truncate text-sm font-semibold text-ink-900">{userName}</p>
        <button
          onClick={() => void handleSignOut()}
          className="text-xs font-medium text-ink-400 underline hover:text-accent-600"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
