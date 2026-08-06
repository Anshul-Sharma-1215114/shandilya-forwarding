"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryPartner } from "@/lib/seller-types";
import { registerDeliveryPartner, type RegisterDeliveryPartnerInput } from "./actions";

const inputClass =
  "w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm text-ink-900 outline-none focus:border-primary-500";

type FormState = {
  phone: string;
  name: string;
  vehicleType: RegisterDeliveryPartnerInput["vehicleType"];
  vehicleNumber: string;
  emergencyContact: string;
};

const EMPTY: FormState = {
  phone: "",
  name: "",
  vehicleType: "bike",
  vehicleNumber: "",
  emergencyContact: "",
};

export default function DeliveryPartnersTable({ partners }: { partners: DeliveryPartner[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    /^[6-9]\d{9}$/.test(form.phone) &&
    form.name.trim().length > 0 &&
    form.vehicleNumber.trim().length >= 3 &&
    /^[6-9]\d{9}$/.test(form.emergencyContact);

  async function handleSubmit() {
    setError(null);
    if (!canSave) {
      setError("Fill in a valid phone, name, vehicle number, and emergency contact.");
      return;
    }

    setBusy(true);
    const result = await registerDeliveryPartner({
      phone: form.phone,
      name: form.name.trim(),
      vehicleType: form.vehicleType,
      vehicleNumber: form.vehicleNumber.trim(),
      emergencyContact: form.emergencyContact,
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
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {open ? "Cancel" : "+ Register Delivery Partner"}
        </button>
      </div>

      {open && (
        <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Phone">
              <input
                className={inputClass}
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                inputMode="numeric"
              />
            </Field>
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Vehicle Type">
              <select
                className={inputClass}
                value={form.vehicleType}
                onChange={(e) =>
                  setForm({ ...form, vehicleType: e.target.value as FormState["vehicleType"] })
                }
              >
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
                <option value="bicycle">Bicycle</option>
              </select>
            </Field>
            <Field label="Vehicle Number">
              <input
                className={inputClass}
                placeholder="e.g. DL01AB1234"
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
              />
            </Field>
            <Field label="Emergency Contact" className="sm:col-span-2">
              <input
                className={inputClass}
                placeholder="10-digit mobile number"
                value={form.emergencyContact}
                onChange={(e) =>
                  setForm({ ...form, emergencyContact: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                inputMode="numeric"
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              disabled={busy || !canSave}
              onClick={() => void handleSubmit()}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Registering..." : "Register"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/8 text-xs uppercase text-ink-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Emergency Contact</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-900">{p.name}</td>
                <td className="px-4 py-3 text-ink-600">+91 {p.phone}</td>
                <td className="px-4 py-3 capitalize text-ink-600">
                  {p.vehicleType ?? "-"} {p.vehicleNumber ? `(${p.vehicleNumber})` : ""}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {p.emergencyContact ? `+91 ${p.emergencyContact}` : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                      p.isAvailable ? "bg-primary-50 text-primary-700" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {p.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-400">
                  No delivery partners registered yet.
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
