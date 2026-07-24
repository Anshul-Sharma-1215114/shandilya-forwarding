"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/data/nav";

export default function CompanyLogo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const src = "/images/logo/logo.jpeg";

  if (!broken) {
    return (
      <div
        className={cn(
          "relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-ink-900/8",
          className
        )}
      >
        <Image
          src={src}
          alt={`${COMPANY.name} logo`}
          fill
          sizes="48px"
          className="object-contain p-0.5"
          onError={() => setBroken(true)}
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 font-display text-lg font-extrabold text-white shadow-md shadow-primary-900/20">
        SF
      </span>
      <span className={cn("font-display leading-tight", dark ? "text-white" : "text-ink-900")}>
        <span className="block text-base font-bold tracking-tight">Shandilya</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">
          Forwarding
        </span>
      </span>
    </div>
  );
}
