"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white shadow-[0_10px_30px_-10px_rgba(20,102,63,0.55)] hover:bg-primary-700",
  secondary:
    "bg-secondary-500 text-white shadow-[0_10px_30px_-10px_rgba(250,124,20,0.55)] hover:bg-secondary-600",
  outline:
    "border-2 border-ink-900/15 text-ink-900 hover:border-primary-600 hover:text-primary-700 bg-white/60 backdrop-blur",
  ghost: "text-ink-800 hover:text-primary-700",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type ButtonProps = Omit<HTMLMotionProps<"button">, "onClick" | "children"> & {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  withIcon?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  withIcon = false,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-300 cursor-pointer",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {withIcon && (
        <ArrowRight
          size={size === "lg" ? 20 : 16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes} onClick={onClick}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button className={classes} onClick={onClick} {...motionProps} {...props}>
      {content}
    </motion.button>
  );
}
