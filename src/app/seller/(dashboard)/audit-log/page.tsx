import Link from "next/link";
import { ScrollText } from "lucide-react";
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
        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900">Audit Log</h1>
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

      <div className="overflow-x-auto rounded-2xl bg-surface card-elevated">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/6 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3.5">When</th>
              <th className="px-5 py-3.5">Actor</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-ink-900/5 transition-colors last:border-0 hover:bg-cream-dim/70">
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-500">
                  {new Date(entry.createdAt).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] font-bold text-ink-600">
                      {entry.actor.name
                        .split(" ")
                        .map((p) => p[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="font-medium text-ink-900">{entry.actor.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700">
                    {entry.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-ink-700">{entry.summary}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-16">
                  <div className="flex flex-col items-center gap-2 text-ink-400">
                    <ScrollText className="h-8 w-8" strokeWidth={1.5} />
                    <p>No audit log entries yet.</p>
                  </div>
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
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-600/25"
          : "border-ink-900/10 bg-surface text-ink-600 hover:border-primary-300"
      )}
    >
      {label}
    </Link>
  );
}
