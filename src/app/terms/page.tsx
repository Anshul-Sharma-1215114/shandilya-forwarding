import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { COMPANY } from "@/data/nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing use of the ${COMPANY.name} website and mobile app.`,
};

const LAST_UPDATED = "18 August 2026";

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-20">
      <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-400">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-600">
        <section>
          <p>
            These terms govern your use of the {COMPANY.name} website and mobile app (together, the
            &quot;Service&quot;), operated from {COMPANY.address}. By creating an account or placing
            an order, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">1. Accounts</h2>
          <p>
            You sign in with your mobile number via a one-time SMS code. You&apos;re responsible for
            keeping access to that number secure, since it&apos;s how orders are authenticated.
            Provide accurate delivery address and contact details - we&apos;re not responsible for a
            failed delivery caused by incorrect information you supplied.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">2. Orders and pricing</h2>
          <p>
            Product prices, pack sizes, and availability shown in the app are set by us and may
            change without notice. Placing an order is an offer to buy at the price shown at
            checkout; we confirm the order once accepted. We reserve the right to cancel an order
            (with a full refund where payment was already made) if a product turns out to be
            unavailable or there&apos;s a genuine pricing error.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">3. Payments</h2>
          <p>
            Online payments are processed by Razorpay; Cash on Delivery is available where offered
            in the app. You agree to pay the full order total, including any delivery charges shown
            at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">4. Cancellations and refunds</h2>
          <p>
            See our{" "}
            <a href="/refund-policy" className="font-semibold text-primary-700">
              Cancellation &amp; Refund Policy
            </a>{" "}
            for the specifics of when an order can be cancelled and how refunds are handled.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">5. Delivery</h2>
          <p>
            Delivery windows shown in the app are estimates, not guarantees - they can be affected
            by traffic, weather, stock availability, and delivery partner availability. We&apos;ll
            keep you updated on order status through the app.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">6. Delivery partners</h2>
          <p>
            If you sign up as a delivery partner within the app, you do so as an independent
            contractor, not an employee of {COMPANY.name}. You&apos;re responsible for complying
            with applicable traffic and vehicle regulations while making deliveries.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">7. Acceptable use</h2>
          <p>
            Don&apos;t misuse the Service - this includes attempting to place fraudulent orders,
            abusing coupon codes, or interfering with the app&apos;s normal operation. We may
            suspend accounts that do.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">8. Changes to these terms</h2>
          <p>
            We may update these terms from time to time; continued use of the Service after a
            change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">9. Contact</h2>
          <p>
            Questions about these terms:{" "}
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
