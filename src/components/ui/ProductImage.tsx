"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_GRADIENTS = {
  primary: "from-primary-100 via-primary-50 to-white",
  secondary: "from-secondary-100 via-secondary-50 to-white",
  accent: "from-accent-100 via-accent-50 to-white",
};

const ACCENT_ICON = {
  primary: "text-primary-400",
  secondary: "text-secondary-400",
  accent: "text-accent-400",
};

const ACCENT_RING = {
  primary: "ring-primary-200/70",
  secondary: "ring-secondary-200/70",
  accent: "ring-accent-200/70",
};

export default function ProductImage({
  src,
  alt,
  name,
  accent = "primary",
  className,
}: {
  src?: string;
  alt: string;
  name: string;
  accent?: "primary" | "secondary" | "accent";
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br p-6 text-center",
          ACCENT_GRADIENTS[accent],
          className
        )}
      >
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-surface ring-1", ACCENT_RING[accent])}>
          <Package size={28} className={ACCENT_ICON[accent]} strokeWidth={1.5} />
        </div>
        <span className="font-display text-sm font-semibold leading-snug text-ink-700">
          {name}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
          Image coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      className={cn("object-contain", className)}
      onError={() => setBroken(true)}
    />
  );
}
