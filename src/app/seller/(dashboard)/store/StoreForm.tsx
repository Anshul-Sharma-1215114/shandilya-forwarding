"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Power, PowerOff, RotateCcw, Clock } from "lucide-react";
import type { StoreStatus } from "@/lib/seller-types";
import { updateStoreStatus } from "./actions";

const inputClass =
  "rounded-lg border border-ink-900/12 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-primary-500";

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
      <div className="rounded-2xl bg-surface p-5 card-elevated">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Current Status</p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              status.isOpen ? "bg-primary-100 text-primary-700" : "bg-accent-50 text-accent-600"
            }`}
          >
            {status.isOpen ? (
              <Power className="h-[18px] w-[18px]" strokeWidth={2.25} />
            ) : (
              <PowerOff className="h-[18px] w-[18px]" strokeWidth={2.25} />
            )}
          </span>
          <div>
            <p className="font-display text-xl font-bold leading-tight text-ink-900">
              {status.isOpen ? "Open" : "Closed"}
            </p>
            <p className="text-xs text-ink-500">{REASON_LABEL[status.reason]}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            <Power className="h-3.5 w-3.5" strokeWidth={2.5} />
            Force Open
          </button>
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(false)}
            className="flex items-center gap-1.5 rounded-full border border-accent-600 px-4 py-2 text-sm font-semibold text-accent-600 transition-colors hover:bg-accent-50 disabled:opacity-50"
          >
            <PowerOff className="h-3.5 w-3.5" strokeWidth={2.5} />
            Force Closed
          </button>
          <button
            disabled={busy}
            onClick={() => void handleManualOverride(null)}
            className="flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-dim disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
            Use Schedule
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-5 card-elevated">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-ink-400" strokeWidth={2} />
          <p className="text-sm font-semibold text-ink-900">Business Hours ({status.timezone})</p>
        </div>
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
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save Hours"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-accent-600">{error}</p>}
    </div>
  );
}
