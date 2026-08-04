import Link from "next/link";
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
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const FILTER_STATUSES: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "packed",
  "ready_for_pickup",
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500">
          Recent orders ({orders.length} of {total} shown).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Today's Revenue" value={formatPrice(todayRevenue)} />
        <StatTile label="Needs Action" value={needsAction} />
        <StatTile label="Out for Delivery" value={counts.out_for_delivery ?? 0} />
        <StatTile label="Delivered" value={counts.delivered ?? 0} />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/seller" label="All" active={!status} />
        {FILTER_STATUSES.map((s) => (
          <FilterChip key={s} href={`/seller?status=${s}`} label={STATUS_LABEL[s]} active={status === s} />
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/8 text-xs uppercase text-ink-400">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-ink-900/5 last:border-0 hover:bg-cream-dim">
                <td className="px-4 py-3">
                  <Link href={`/seller/orders/${order.id}`} className="font-semibold text-primary-700">
                    #{order.id.slice(-8)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink-900">{order.user.name}</p>
                  <p className="text-xs text-ink-400">{order.user.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold uppercase text-primary-700">
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-ink-900">{formatPrice(order.totalInPaise)}</td>
                <td className="px-4 py-3 text-ink-500">
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
                <td colSpan={5} className="px-4 py-10 text-center text-ink-400">
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

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-ink-900/8 bg-white px-4 py-3">
      <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold",
        active
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-ink-900/10 bg-white text-ink-600 hover:border-primary-300"
      )}
    >
      {label}
    </Link>
  );
}
