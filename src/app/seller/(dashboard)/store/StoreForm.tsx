"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreStatus } from "@/lib/seller-types";
import { updateStoreStatus } from "./actions";

const inputClass =
  "rounded-lg border border-ink-900/15 px-3 py-2 text-sm text-ink-900 outline-none focus:border-primary-500";

const REASON_LABEL: Record<StoreStatus["reason"], string> = {
  open: "Open",
  closed_manual: "Closed (manual override)",
  closed_hours: "Closed (outside business hours)",
  opening_soon: "Opening soon",
  closing_soon: "Closing soon",
};

export default function StoreForm({ status }: { status: StoreStatus }) {
  const router = useRouter();
  const [openTime, setOpenTime] = useState(status.openTime);
  const [closeTime, setCloseTime] = useState(status.closeTime);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleManualOverride(value: boolean | null) {
    setError(null);
    setBusy(true);
    const result = await updateStoreStatus({ isManuallyOpen: value });
    setBusy(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleSaveHours() {
    setError(null);
    setBusy(true);
    const result = await updateStoreStatus({ openTime, closeTime });
    setBusy(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
        <p className="text-sm font-semibold text-ink-900">Current Status</p>
        <p className="text-2xl font-extrabold text-ink-900">{status.isOpen ? "Open" : "Closed"}</p>
        <p className="text-xs text-ink-500">{REASON_LABEL[status.reason]}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(true)}
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Force Open
          </button>
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(false)}
            className="rounded-full border border-accent-600 px-4 py-2 text-sm font-semibold text-accent-600 disabled:opacity-50"
          >
            Force Closed
          </button>
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(null)}
            className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 disabled:opacity-50"
          >
            Use Schedule
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-ink-900">Business Hours ({status.timezone})</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-ink-600">
            Opens
            <input
              type="time"
              className={inputClass}
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              // Chrome injects a caret-color style on type="time" inputs
              // client-side only, causing a benign hydration mismatch on
              // this one cosmetic attribute - not a real render mismatch.
              suppressHydrationWarning
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-ink-600">
            Closes
            <input
              type="time"
              className={inputClass}
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              suppressHydrationWarning
            />
          </label>
          <button
            disabled={busy}
            onClick={() => void handleSaveHours()}
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save Hours"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
