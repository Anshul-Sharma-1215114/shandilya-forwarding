import { notFound } from "next/navigation";
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
        <h1 className="font-display text-2xl font-bold text-ink-900">Order #{order.id.slice(-8)}</h1>
        <p className="text-sm text-ink-500">Placed {new Date(order.createdAt).toLocaleString("en-IN")}</p>
      </div>

      <OrderActions order={order} partners={partners} />

      {TRACKABLE_STATUSES.has(order.status) && (
        <Card title="Live Location">
          <DeliveryTrackingMapLoader orderId={order.id} />
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Customer">
          <p className="font-semibold text-ink-900">{order.user.name}</p>
          <p className="text-sm text-ink-500">+91 {order.user.phone}</p>
          {order.user.email && <p className="text-sm text-ink-500">{order.user.email}</p>}
        </Card>

        <Card title="Delivery Address">
          <p className="text-sm text-ink-700">
            {order.deliveryAddress.line1}
            {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""}, {order.deliveryAddress.city},{" "}
            {order.deliveryAddress.state} {order.deliveryAddress.pincode}
          </p>
        </Card>
      </div>

      <Card title="Items">
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">
                {item.quantity} × {item.name}
              </span>
              <span className="font-semibold text-ink-900">
                {formatPrice(item.unitPriceInPaise * item.quantity)}
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-ink-900/8 pt-2">
            <span className="font-semibold text-ink-900">Total</span>
            <span className="font-extrabold text-primary-700">{formatPrice(order.totalInPaise)}</span>
          </div>
          {order.payment && (
            <p className="text-xs text-ink-400">
              Payment: {order.payment.status}{" "}
              {order.payment.provider === "cod" ? "via Cash on Delivery" : "via Razorpay"}
            </p>
          )}
        </div>
      </Card>

      {order.timeline && order.timeline.length > 0 && (
        <Card title="Timeline">
          <div className="flex flex-col gap-2 text-sm">
            {order.timeline.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-4">
                <span className="text-ink-700">
                  {event.event}
                  {event.remarks ? ` — ${event.remarks}` : ""}
                </span>
                <span className="shrink-0 text-xs text-ink-400">
                  {new Date(event.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">{title}</h2>
      {children}
    </div>
  );
}
