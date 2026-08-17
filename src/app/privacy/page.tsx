import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { COMPANY } from "@/data/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${COMPANY.name} collects, uses and protects your information on our website and mobile app.`,
};

const LAST_UPDATED = "18 August 2026";

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-3xl py-20">
      <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-400">Last updated: {LAST_UPDATED}</p>

      <div className="prose-content mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">1. Who we are</h2>
          <p>
            This policy covers {COMPANY.name} (&quot;we&quot;, &quot;us&quot;), the operator of this
            website and the Shandilya Forwarding mobile app, and describes how we handle
            information collected when you browse our site, place an order, sign up as a delivery
            partner, or contact us. Our registered address is {COMPANY.address}.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">2. Information we collect</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Account details</strong> - your name and mobile number, used to sign in via a
              one-time password (OTP). We never see or store your password because there isn&apos;t
              one; sign-in is by SMS code only.
            </li>
            <li>
              <strong>Delivery addresses</strong> - the address text and, if you drop a map pin, its
              GPS coordinates, so orders reach the right place.
            </li>
            <li>
              <strong>Order history</strong> - items purchased, amounts paid, and delivery status,
              kept as your purchase record and for our own accounting.
            </li>
            <li>
              <strong>Live location (delivery partners only)</strong> - while a delivery partner has
              an active delivery open in the app, their device location is shared with us and
              shown to the customer and seller on a live map, so the delivery can be tracked in
              real time. This stops as soon as the delivery is completed or the app is closed;
              customer accounts never share location this way.
            </li>
            <li>
              <strong>Payment information</strong> - payments are processed by Razorpay, our payment
              gateway partner. We never see or store your card, UPI, or bank details ourselves; we
              only receive confirmation that a payment succeeded or failed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">3. How we use it</h2>
          <p>
            We use this information solely to operate the service: creating and fulfilling your
            orders, assigning and tracking deliveries, sending order-status updates, resolving
            support requests, and maintaining our own sales and inventory records. We do not sell
            your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">4. Who we share it with</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Razorpay</strong>, to process payments - governed by Razorpay&apos;s own
              privacy policy.
            </li>
            <li>
              <strong>MSG91</strong>, our SMS provider, solely to deliver the OTP code to your phone
              number at sign-in.
            </li>
            <li>
              <strong>Our delivery partners</strong>, who see the delivery address and your name and
              phone number for the specific order assigned to them, so they can complete the
              delivery.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">5. Data retention</h2>
          <p>
            We retain order and account records for as long as needed for accounting, warranty, and
            legal purposes. You can request deletion of your account and associated personal data
            at any time by contacting us (details below); order records tied to completed
            transactions may be retained where required for tax/accounting compliance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">6. Your choices</h2>
          <p>
            You can update your saved addresses and profile details directly in the app. To request
            a copy of your data, ask a correction, or delete your account, contact us using the
            details below.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-ink-900">7. Contact us</h2>
          <p>
            Questions about this policy or your data can be sent to{" "}
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
