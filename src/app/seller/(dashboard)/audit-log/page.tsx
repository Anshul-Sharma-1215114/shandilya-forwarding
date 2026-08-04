import Link from "next/link";
import { sellerFetch } from "@/lib/seller-session";
import type { AuditLogEntry } from "@/lib/seller-types";
import { cn } from "@/lib/utils";

const ENTITY_TYPES = ["Product", "Coupon", "StoreSettings"];

export default async function SellerAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string }>;
}) {
  const { entityType } = await searchParams;
  const query = entityType ? `&entityType=${encodeURIComponent(entityType)}` : "";
  const { entries, total } = await sellerFetch<{ entries: AuditLogEntry[]; total: number }>(
    `/api/audit-log?pageSize=50${query}`
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Audit Log</h1>
        <p className="text-sm text-ink-500">
          {entries.length} of {total} entries shown. Stock adjustments and order status changes
          have their own history on the Products and Order pages.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/seller/audit-log" label="All" active={!entityType} />
        {ENTITY_TYPES.map((t) => (
          <FilterChip
            key={t}
            href={`/seller/audit-log?entityType=${t}`}
            label={t}
            active={entityType === t}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/8 text-xs uppercase text-ink-400">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-ink-900/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                  {new Date(entry.createdAt).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 font-medium text-ink-900">{entry.actor.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold uppercase text-primary-700">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-700">{entry.summary}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-400">
                  No audit log entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold",
        active
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-ink-900/10 bg-white text-ink-600 hover:border-primary-300"
      )}
    >
      {label}
    </Link>
  );
}
