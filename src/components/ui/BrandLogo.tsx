"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BrandLogo({
  src,
  name,
  className,
  imgClassName,
}: {
  src?: string;
  name: string;
  className?: string;
  imgClassName?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <span className={cn("font-display text-sm font-bold tracking-tight text-ink-800", className)}>
        {name}
      </span>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={`${name} logo`}
        fill
        sizes="200px"
        className={cn("object-contain", imgClassName)}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
