"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Ticket, X } from "lucide-react";
import type { Coupon, CouponType } from "@/lib/seller-types";
import { createCoupon } from "./actions";

const inputClass =
  "w-full rounded-lg border border-ink-900/12 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-primary-500";

function formatValue(c: Coupon) {
  if (c.type === "percentage") return `${c.value}%`;
  if (c.type === "flat") return `₹${(c.value / 100).toFixed(2)}`;
  return "Free delivery";
}

type FormState = {
  code: string;
  description: string;
  type: CouponType;
  value: string;
  minOrder: string;
  maxDiscount: string;
  maxUses: string;
  perUserLimit: string;
  expiresAt: string;
};

const EMPTY: FormState = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  minOrder: "0",
  maxDiscount: "",
  maxUses: "",
  perUserLimit: "",
  expiresAt: "",
};

export default function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!form.code || (form.type !== "free_delivery" && !form.value)) {
      setError("Enter a code and a value.");
      return;
    }

    const value =
      form.type === "percentage"
        ? Math.round(Number(form.value))
        : form.type === "flat"
          ? Math.round(parseFloat(form.value) * 100)
          : 0;

    if (Number.isNaN(value)) {
      setError("Enter a valid value.");
      return;
    }

    setBusy(true);
    const result = await createCoupon({
      code: form.code,
      description: form.description || undefined,
      type: form.type,
      value,
      minOrderInPaise: Math.round(parseFloat(form.minOrder || "0") * 100),
      maxDiscountInPaise: form.maxDiscount ? Math.round(parseFloat(form.maxDiscount) * 100) : undefined,
      maxUses: form.maxUses ? Math.round(Number(form.maxUses)) : undefined,
      perUserLimit: form.perUserLimit ? Math.round(Number(form.perUserLimit)) : undefined,
      active: true,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
    });
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setForm(EMPTY);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700"
        >
          {open ? <X className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
          {open ? "Cancel" : "New Coupon"}
        </button>
      </div>

      {open && (
        <div className="rounded-2xl bg-surface p-5 card-elevated">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Code">
              <input
                className={inputClass}
                placeholder="WELCOME10"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </Field>
            <Field label="Type">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat amount</option>
                <option value="free_delivery">Free delivery</option>
              </select>
            </Field>
            {form.type !== "free_delivery" && (
              <Field label={form.type === "percentage" ? "Value (%)" : "Value (₹)"}>
                <input
                  className={inputClass}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  inputMode="decimal"
                />
              </Field>
            )}
            <Field label="Minimum Order (₹)">
              <input
                className={inputClass}
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Max Discount (₹, optional)">
              <input
                className={inputClass}
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Max Uses (optional)">
              <input
                className={inputClass}
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                inputMode="numeric"
              />
            </Field>
            <Field label="Per-user Limit (optional)">
              <input
                className={inputClass}
                value={form.perUserLimit}
                onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                inputMode="numeric"
              />
            </Field>
            <Field label="Expires (optional)">
              <input
                type="date"
                className={inputClass}
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </Field>
            <Field label="Description (optional)" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              disabled={busy}
              onClick={() => void handleSubmit()}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create Coupon"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm font-medium text-accent-600">{error}</p>}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-surface card-elevated">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/6 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3.5">Code</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Value</th>
              <th className="px-5 py-3.5">Min Order</th>
              <th className="px-5 py-3.5">Expires</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-ink-900/5 transition-colors last:border-0 hover:bg-cream-dim/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
                      <Ticket className="h-[15px] w-[15px]" strokeWidth={2.25} />
                    </div>
                    <span className="font-mono text-sm font-semibold text-ink-900">{c.code}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 capitalize text-ink-600">{c.type.replace("_", " ")}</td>
                <td className="px-5 py-3.5 font-medium text-ink-900">{formatValue(c)}</td>
                <td className="px-5 py-3.5 text-ink-600">₹{(c.minOrderInPaise / 100).toFixed(2)}</td>
                <td className="px-5 py-3.5 text-ink-500">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      c.active ? "bg-primary-100 text-primary-700" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center text-ink-400">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-xs font-medium text-ink-600 ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}
