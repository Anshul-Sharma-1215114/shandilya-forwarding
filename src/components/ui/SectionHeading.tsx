import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "primary" | "secondary" | "accent";
  className?: string;
};

const THEME_CLASSES = {
  primary: "text-primary-700 bg-primary-50 ring-primary-200",
  secondary: "text-secondary-700 bg-secondary-50 ring-secondary-200",
  accent: "text-accent-700 bg-accent-50 ring-accent-200",
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "primary",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <Reveal>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ring-1",
            THEME_CLASSES[theme]
          )}
        >
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-display text-balance text-3xl font-bold leading-[1.12] text-ink-900 sm:text-4xl lg:text-[2.75rem]",
            align === "center" ? "max-w-3xl" : "max-w-2xl"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "text-balance text-base leading-relaxed text-ink-500 sm:text-lg",
              align === "center" ? "max-w-2xl" : "max-w-xl"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
