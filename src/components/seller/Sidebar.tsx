"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Ticket,
  Bike,
  Store,
  ScrollText,
  LogOut,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/seller", label: "Dashboard", icon: LayoutGrid },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/coupons", label: "Coupons", icon: Ticket },
  { href: "/seller/delivery-partners", label: "Delivery Partners", icon: Bike },
  { href: "/seller/store", label: "Store Settings", icon: Store },
  { href: "/seller/audit-log", label: "Audit Log", icon: ScrollText },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto bg-surface px-4 py-6 shadow-[1px_0_0_0_rgba(28,32,25,0.06),4px_0_24px_-8px_rgba(28,32,25,0.06)]">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary-900/20">
            <Droplets className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-[15px] font-bold leading-tight text-ink-900">
              Shandilya
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Seller Portal</p>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/seller"
                ? pathname === "/seller" || pathname?.startsWith("/seller/orders")
                : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30"
                    : "text-ink-600 hover:bg-cream-dim hover:text-ink-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    active ? "text-white" : "text-ink-400 group-hover:text-primary-600"
                  )}
                  strokeWidth={2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-ink-900/8 bg-cream-dim/60 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
          {initials(userName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{userName}</p>
          <p className="text-[11px] text-ink-400">Seller</p>
        </div>
        <button
          onClick={() => void handleSignOut()}
          aria-label="Sign out"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-accent-50 hover:text-accent-600"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
