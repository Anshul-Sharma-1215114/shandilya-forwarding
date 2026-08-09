"use client";

import {
  ShieldCheck,
  Truck,
  PackageCheck,
  Network,
  HandCoins,
  Headset,
  BadgeCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { WHY_CHOOSE_US } from "@/data/whyChooseUs";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Truck,
  PackageCheck,
  Network,
  HandCoins,
  Headset,
  BadgeCheck,
  TrendingUp,
};

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      data-theme="light"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-ink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(44,107,201,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(239,74,31,0.25),transparent_45%)]" />
        <div className="grain-overlay opacity-[0.06]" />
      </div>

      <Container>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A Distribution Partner You Can Build Your Business On"
          description="From authenticity to logistics, here's what businesses across our network count on us for, day after day."
          theme="primary"
          className="mb-16 [&_h2]:text-white [&_p]:text-ink-200"
        />

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map(({ icon, title, description }) => {
            const Icon = ICONS[icon];
            return (
              <StaggerItem key={title}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-400/40 hover:bg-white/[0.08]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-900/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-display mt-5 text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-200/80">{description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
