import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { COMPANY } from "@/data/nav";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: `How order cancellations and refunds work on the ${COMPANY.name} app.`,
};

const LAST_UPDATED = "18 August 2026";

export default function RefundPolicyPage() {
  return (
    <Container className="max-w-3xl py-20">
      <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
        Cancellation &amp; Refund Policy
      </h1>
      <p className="mt-2 text-sm text-ink-400">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">Cancelling an order</h2>
          <p>
            You can cancel an order yourself from the Orders screen in the app, free of charge,
            any time before we&apos;ve finished packing it (i.e. while it&apos;s shown as awaiting
            payment, placed, confirmed, or being prepared). Once an order has been packed and is
            ready for pickup by a delivery partner, it can no longer be self-cancelled in the app -
            contact us directly and we&apos;ll do our best to help.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">Refunds</h2>
          <p>
            If you paid online (via Razorpay) and cancel an order before it ships, the full amount
            is refunded automatically to your original payment method as soon as the cancellation
            is confirmed. Refunds are initiated immediately on our end; Razorpay and your bank may
            take a few business days to actually credit the amount back to your account, which is
            outside our control.
          </p>
          <p className="mt-2">
            If you paid Cash on Delivery and cancel before the order is delivered, there&apos;s
            nothing to refund since no payment was collected yet.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">Cancellations by us</h2>
          <p>
            Occasionally we may need to cancel an order ourselves - most commonly because a product
            turned out to be unavailable. In that case any amount already paid is refunded in full,
            following the same process as above.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">Damaged, incorrect, or missing items</h2>
          <p>
            If what arrives doesn&apos;t match your order - wrong item, missing item, or visibly
            damaged packaging - contact us within 24 hours of delivery with your order number and
            we&apos;ll arrange a replacement or refund for the affected item(s).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">Contact</h2>
          <p>
            For help with a cancellation or refund:{" "}
            <a href={`mailto:${COMPANY.email}`} className="font-semibold text-primary-700">
              {COMPANY.email}
            </a>{" "}
            or {COMPANY.phone}.
          </p>
        </section>
      </div>
    </Container>
  );
}
