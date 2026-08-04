"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Product } from "@/lib/seller-types";
import { BRAND_LABELS } from "@/lib/seller-types";
import { adjustStock, createProduct, updateProduct } from "./actions";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

const BRANDS: Brand[] = ["ZEALUP_WATER", "PARLE_AGRO", "BALAJI_WAFERS"];
const inputClass =
  "w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm text-ink-900 outline-none focus:border-primary-500";

type FormState = {
  slug: string;
  name: string;
  description: string;
  brand: Brand;
  category: string;
  imageUrl: string;
  price: string;
  unit: string;
};

const EMPTY_FORM: FormState = {
  slug: "",
  name: "",
  description: "",
  brand: "ZEALUP_WATER",
  category: "",
  imageUrl: "",
  price: "",
  unit: "",
};

function productToForm(p: Product): FormState {
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    brand: p.brand,
    category: p.category,
    imageUrl: p.imageUrl ?? "",
    price: (p.priceInPaise / 100).toString(),
    unit: p.unit,
  };
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockDraft, setStockDraft] = useState<Record<string, { qty: string; reason: string }>>({});

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setError(null);
  }

  function startEdit(p: Product) {
    setForm(productToForm(p));
    setEditingId(p.id);
    setError(null);
  }

  async function handleSubmit() {
    setError(null);
    const priceInPaise = Math.round(parseFloat(form.price) * 100);
    if (
      !form.slug ||
      !form.name ||
      !form.description ||
      !form.category ||
      !form.unit ||
      Number.isNaN(priceInPaise)
    ) {
      setError("Fill in all fields with a valid price.");
      return;
    }
    setBusy(true);
    const input = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      brand: form.brand,
      category: form.category,
      imageUrl: form.imageUrl || undefined,
      priceInPaise,
      unit: form.unit,
    };
    const result =
      editingId === "new" ? await createProduct(input) : await updateProduct(editingId!, input);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleToggleActive(p: Product) {
    setBusy(true);
    const result = await updateProduct(p.id, { active: !p.active });
    setBusy(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleStockAdjust(p: Product) {
    const draft = stockDraft[p.id];
    const qty = Number(draft?.qty);
    if (!draft?.qty || Number.isNaN(qty) || qty === 0 || !draft.reason) {
      setError("Enter a non-zero quantity and a reason to adjust stock.");
      return;
    }
    setBusy(true);
    const result = await adjustStock(p.id, qty, draft.reason);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setStockDraft((prev) => ({ ...prev, [p.id]: { qty: "", reason: "" } }));
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={startCreate}
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + Add Product
        </button>
      </div>

      {editingId && (
        <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            {editingId === "new" ? "New Product" : "Edit Product"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Slug">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={editingId !== "new"}
              />
            </Field>
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Brand">
              <select
                className={inputClass}
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value as Brand })}
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {BRAND_LABELS[b]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Price (₹)">
              <input
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Unit">
              <input
                className={inputClass}
                placeholder="e.g. 500 ml"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </Field>
            <Field label="Image URL" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className={inputClass}
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              disabled={busy}
              onClick={() => void handleSubmit()}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-ink-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/8 text-xs uppercase text-ink-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 align-top last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.category}</p>
                </td>
                <td className="px-4 py-3 text-ink-600">{BRAND_LABELS[p.brand]}</td>
                <td className="px-4 py-3 font-semibold text-ink-900">{formatPrice(p.priceInPaise)}</td>
                <td className="px-4 py-3">
                  <p className="mb-1 font-semibold text-ink-900">{p.stockQty}</p>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="±qty"
                      className="w-16 rounded border border-ink-900/15 px-1.5 py-1 text-xs"
                      value={stockDraft[p.id]?.qty ?? ""}
                      onChange={(e) =>
                        setStockDraft((prev) => ({
                          ...prev,
                          [p.id]: { qty: e.target.value, reason: prev[p.id]?.reason ?? "" },
                        }))
                      }
                    />
                    <input
                      placeholder="reason"
                      className="w-20 rounded border border-ink-900/15 px-1.5 py-1 text-xs"
                      value={stockDraft[p.id]?.reason ?? ""}
                      onChange={(e) =>
                        setStockDraft((prev) => ({
                          ...prev,
                          [p.id]: { qty: prev[p.id]?.qty ?? "", reason: e.target.value },
                        }))
                      }
                    />
                    <button
                      disabled={busy}
                      onClick={() => void handleStockAdjust(p)}
                      className="rounded border border-primary-600 px-2 py-1 text-xs font-semibold text-primary-700 disabled:opacity-50"
                    >
                      Go
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={busy}
                    onClick={() => void handleToggleActive(p)}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                      p.active ? "bg-primary-50 text-primary-700" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-xs font-semibold text-primary-700 underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-400">
                  No products yet.
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
