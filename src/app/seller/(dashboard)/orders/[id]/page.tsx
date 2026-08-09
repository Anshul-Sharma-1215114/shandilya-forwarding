import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, MapPin, Package, Clock, Receipt } from "lucide-react";
import { sellerFetch, SellerApiError } from "@/lib/seller-session";
import type { DeliveryPartner, Order } from "@/lib/seller-types";
import OrderActions from "./OrderActions";
import DeliveryTrackingMapLoader from "./DeliveryTrackingMapLoader";

const TRACKABLE_STATUSES = new Set(["picked_up", "out_for_delivery"]);

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order: Order;
  let partners: DeliveryPartner[];
  try {
    const [orderRes, partnersRes] = await Promise.all([
      sellerFetch<{ order: Order }>(`/api/orders/${id}`),
      sellerFetch<{ partners: DeliveryPartner[] }>("/api/delivery-partners"),
    ]);
    order = orderRes.order;
    partners = partnersRes.partners;
  } catch (err) {
    if (err instanceof SellerApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/seller"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">
          Order <span className="font-mono text-primary-700">#{order.id.slice(-8)}</span>
        </h1>
        <p className="text-sm text-ink-500">Placed {new Date(order.createdAt).toLocaleString("en-IN")}</p>
      </div>

      <OrderActions order={order} partners={partners} />

      {TRACKABLE_STATUSES.has(order.status) && (
        <Card title="Live Location" icon={MapPin}>
          <DeliveryTrackingMapLoader
            orderId={order.id}
            destLat={order.deliveryAddress.lat}
            destLng={order.deliveryAddress.lng}
          />
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Customer" icon={User}>
          <p className="font-semibold text-ink-900">{order.user.name}</p>
          <p className="text-sm text-ink-500">+91 {order.user.phone}</p>
          {order.user.email && <p className="text-sm text-ink-500">{order.user.email}</p>}
        </Card>

        <Card title="Delivery Address" icon={MapPin}>
          <p className="text-sm leading-relaxed text-ink-700">
            {order.deliveryAddress.line1}
            {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""}, {order.deliveryAddress.city},{" "}
            {order.deliveryAddress.state} {order.deliveryAddress.pincode}
          </p>
        </Card>
      </div>

      <Card title="Items" icon={Package}>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink-700">
                <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-ink-100 px-1 text-[11px] font-bold text-ink-600">
                  {item.quantity}
                </span>
                {item.name}
              </span>
              <span className="font-semibold tabular-nums text-ink-900">
                {formatPrice(item.unitPriceInPaise * item.quantity)}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-ink-900/8 pt-3">
            <span className="font-semibold text-ink-900">Total</span>
            <span className="font-display text-lg font-extrabold tabular-nums text-primary-700">
              {formatPrice(order.totalInPaise)}
            </span>
          </div>
          {order.payment && (
            <div className="flex items-center gap-1.5 text-xs text-ink-400">
              <Receipt className="h-3.5 w-3.5" strokeWidth={2} />
              {order.payment.status}{" "}
              {order.payment.provider === "cod" ? "via Cash on Delivery" : "via Razorpay"}
            </div>
          )}
        </div>
      </Card>

      {order.timeline && order.timeline.length > 0 && (
        <Card title="Timeline" icon={Clock}>
          <div className="flex flex-col">
            {order.timeline.map((event, i) => (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  {i < order.timeline!.length - 1 && <div className="w-px flex-1 bg-ink-900/8" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-ink-800">
                    {event.event}
                    {event.remarks ? <span className="text-ink-500"> — {event.remarks}</span> : null}
                  </p>
                  <p className="text-xs text-ink-400">{new Date(event.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface p-5 card-elevated">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        {title}
      </h2>
      {children}
    </div>
  );
}
