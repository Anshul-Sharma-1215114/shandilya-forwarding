import Link from "next/link";
import { IndianRupee, AlertCircle, Bike, CheckCircle2 } from "lucide-react";
import { sellerFetch } from "@/lib/seller-session";
import type { Order, OrderStatus } from "@/lib/seller-types";
import { cn } from "@/lib/utils";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Payment Pending",
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  packed: "Packed",
  ready_for_pickup: "Ready for Pickup",
  accepted: "Accepted",
  picked_up: "Picked Up",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Semantic color per status, not a single reused green regardless of
// meaning - amber for what needs the seller's attention, blue for handed
// off to delivery, green for success, red for cancelled.
const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_payment: "bg-ink-100 text-ink-600",
  placed: "bg-secondary-100 text-secondary-700",
  confirmed: "bg-secondary-100 text-secondary-700",
  preparing: "bg-secondary-100 text-secondary-700",
  packed: "bg-secondary-100 text-secondary-700",
  ready_for_pickup: "bg-blue-100 text-blue-700",
  accepted: "bg-blue-100 text-blue-700",
  picked_up: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-primary-100 text-primary-700",
  cancelled: "bg-accent-100 text-accent-700",
};

const FILTER_STATUSES: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "packed",
  "ready_for_pickup",
  "accepted",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const NEEDS_ACTION: OrderStatus[] = ["placed", "confirmed", "preparing", "packed"];

export default async function SellerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const query = status ? `&status=${encodeURIComponent(status)}` : "";
  const { orders, total } = await sellerFetch<{ orders: Order[]; total: number }>(
    `/api/orders/all?pageSize=100${query}`
  );

  const counts = orders.reduce<Partial<Record<OrderStatus, number>>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const todayRevenue = orders
    .filter((o) => o.status !== "pending_payment" && o.status !== "cancelled" && isToday(o.createdAt))
    .reduce((sum, o) => sum + o.totalInPaise, 0);
  const needsAction = NEEDS_ACTION.reduce((sum, s) => sum + (counts[s] ?? 0), 0);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500">
          Recent orders — {orders.length} of {total} shown
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Today's Revenue"
          value={formatPrice(todayRevenue)}
          icon={IndianRupee}
          tone="primary"
        />
        <StatTile label="Needs Action" value={needsAction} icon={AlertCircle} tone="secondary" />
        <StatTile label="Out for Delivery" value={counts.out_for_delivery ?? 0} icon={Bike} tone="blue" />
        <StatTile label="Delivered" value={counts.delivered ?? 0} icon={CheckCircle2} tone="primary" />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/seller" label="All" active={!status} />
        {FILTER_STATUSES.map((s) => (
          <FilterChip key={s} href={`/seller?status=${s}`} label={STATUS_LABEL[s]} active={status === s} />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface card-elevated">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/6 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="group border-b border-ink-900/5 transition-colors last:border-0 hover:bg-cream-dim/70">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/seller/orders/${order.id}`}
                    className="font-mono text-[13px] font-semibold text-primary-700 group-hover:underline"
                  >
                    #{order.id.slice(-8)}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] font-bold text-ink-600">
                      {order.user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium leading-tight text-ink-900">{order.user.name}</p>
                      <p className="text-xs text-ink-400">{order.user.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                      STATUS_STYLE[order.status]
                    )}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-ink-900">
                  {formatPrice(order.totalInPaise)}
                </td>
                <td className="px-5 py-3.5 text-ink-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center text-ink-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TILE_TONE = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  blue: "bg-blue-50 text-blue-600",
} as const;

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: keyof typeof TILE_TONE;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 card-elevated">
      <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-lg", TILE_TONE[tone])}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </div>
      <p className="font-display text-2xl font-bold tabular-nums text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
          : "bg-surface text-ink-600 shadow-[0_1px_2px_rgba(28,32,25,0.04),0_2px_8px_-4px_rgba(28,32,25,0.08)] hover:text-primary-700"
      )}
    >
      {label}
    </Link>
  );
}
