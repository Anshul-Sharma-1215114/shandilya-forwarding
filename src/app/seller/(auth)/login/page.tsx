"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type Step = "phone" | "otp";

export default function SellerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleRequestOtp() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/seller/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't send the code");
      setDevCode(data.devCode ?? null);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/seller/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid or expired code");
      router.replace("/seller");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-ink-900/8 bg-surface p-8 shadow-sm">
      <h1 className="font-display text-xl font-bold text-ink-900">
        {step === "phone" ? "Seller Sign In" : "Enter the code we sent"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {step === "phone"
          ? "Sign in with your registered seller phone number."
          : `We sent a code to +91 ${phone}.`}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {step === "phone" && (
          <>
            <input
              className="w-full rounded-xl border border-ink-900/15 bg-surface px-4 py-3 text-center text-base text-ink-900 outline-none focus:border-primary-500"
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
            <Button
              className="w-full"
              disabled={busy || phone.length !== 10}
              onClick={() => void handleRequestOtp()}
            >
              {busy ? "Sending..." : "Send OTP"}
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            {devCode && (
              <p className="text-center text-xs text-ink-400">
                Dev mode - no SMS sent, your code is {devCode}
              </p>
            )}
            <input
              className="w-full rounded-xl border border-ink-900/15 bg-surface px-4 py-3 text-center text-base text-ink-900 outline-none focus:border-primary-500"
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <Button
              className="w-full"
              disabled={busy || code.length !== 6}
              onClick={() => void handleVerify()}
            >
              {busy ? "Verifying..." : "Verify"}
            </Button>
            <button
              type="button"
              className="text-xs text-ink-400 underline"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError(null);
              }}
            >
              Use a different number
            </button>
          </>
        )}

        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
