"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, ImageOff } from "lucide-react";
import type { Brand, Product } from "@/lib/seller-types";
import { BRAND_LABELS } from "@/lib/seller-types";
import { adjustStock, createProduct, updateProduct } from "./actions";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

const BRANDS: Brand[] = ["ZEALUP_WATER", "PARLE_AGRO", "BALAJI_WAFERS"];
const inputClass =
  "w-full rounded-lg border border-ink-900/12 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-primary-500";

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
          className="flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      {editingId && (
        <div className="rounded-2xl bg-surface p-5 card-elevated">
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
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-dim"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-accent-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl bg-surface card-elevated">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/6 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Brand</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 align-top transition-colors last:border-0 hover:bg-cream-dim/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-100">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small external thumbnail, not worth next/image remote config
                        <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff className="h-4 w-4 text-ink-300" strokeWidth={1.75} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium leading-tight text-ink-900">{p.name}</p>
                      <p className="text-xs text-ink-400">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-ink-600">{BRAND_LABELS[p.brand]}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-ink-900">{formatPrice(p.priceInPaise)}</td>
                <td className="px-5 py-3.5">
                  <p className="mb-1.5 font-semibold tabular-nums text-ink-900">{p.stockQty}</p>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="±qty"
                      className="w-16 rounded-md border border-ink-900/12 px-1.5 py-1 text-xs outline-none focus:border-primary-500"
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
                      className="w-20 rounded-md border border-ink-900/12 px-1.5 py-1 text-xs outline-none focus:border-primary-500"
                      value={stockDraft[p.id]?.reason ?? ""}
                      onChange={(e) =>
                        setStockDraft((prev) => ({
                          ...prev,
                          [p.id]: { qty: prev[p.id]?.qty ?? "", reason: e.target.value },
                        }))
                      }
                    />
                    <button
                      data-theme="light"
                      disabled={busy}
                      onClick={() => void handleStockAdjust(p)}
                      className="rounded-md bg-ink-900 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-50"
                    >
                      Go
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    disabled={busy}
                    onClick={() => void handleToggleActive(p)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                      p.active ? "bg-primary-100 text-primary-700" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => startEdit(p)}
                    aria-label="Edit product"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Pencil className="h-[15px] w-[15px]" strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center text-ink-400">
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
