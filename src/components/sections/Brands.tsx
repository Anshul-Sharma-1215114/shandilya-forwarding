"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import BrandLogo from "@/components/ui/BrandLogo";
import { BRANDS } from "@/data/brands";
import { cn } from "@/lib/utils";

const THEME = {
  primary: {
    badge: "bg-primary-50 text-primary-700 ring-primary-200",
    check: "bg-primary-600 text-white",
    glow: "bg-primary-200/50",
  },
  secondary: {
    badge: "bg-secondary-50 text-secondary-700 ring-secondary-200",
    check: "bg-secondary-500 text-white",
    glow: "bg-secondary-200/50",
  },
  accent: {
    badge: "bg-accent-50 text-accent-700 ring-accent-200",
    check: "bg-accent-600 text-white",
    glow: "bg-accent-200/50",
  },
  // Campa's own real-world brand colour (the Cola bottle's label purple) -
  // primary/secondary/accent are each already spoken for by the other
  // three brands, so this uses Tailwind's default violet scale directly
  // rather than introducing a new site-wide design token for one section.
  campa: {
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
    check: "bg-violet-600 text-white",
    glow: "bg-violet-200/50",
  },
  // Deliberately not one of the four FMCG brand colours - these are
  // Shandilya's own products, not a distributed brand, so a distinct
  // neutral-ish green reads as "practical/utility" rather than competing
  // for attention with the flashier consumer brands above.
  inhouse: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    check: "bg-emerald-600 text-white",
    glow: "bg-emerald-200/50",
  },
};

export default function Brands() {
  return (
    <section id="brands" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Brands"
          title="Trusted Brands, Plus Our Own Products"
          description="We are proud to be the authorized distribution partner for these leading FMCG brands - and we supply a few of our own in-house products directly too."
          className="mb-16"
        />

        <div className="flex flex-col gap-14">
          {BRANDS.map((brand, index) => {
            const theme = THEME[brand.theme];
            const reversed = index % 2 === 1;

            return (
              <Reveal key={brand.slug} delay={0.05}>
                <div
                  className={cn(
                    "grid items-center gap-10 overflow-hidden rounded-[2rem] border border-ink-900/8 bg-surface/70 p-6 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10",
                    reversed && "lg:[&>*:first-child]:order-2"
                  )}
                >
                  <div className="relative">
                    <div aria-hidden className={cn("absolute -inset-6 -z-10 rounded-[2.5rem] blur-2xl", theme.glow)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6 }}
                      className={cn(
                        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg",
                        brand.imageFit === "contain" && "bg-surface"
                      )}
                    >
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 1024px) 90vw, 45vw"
                        className={cn(
                          "transition-transform duration-700 hover:scale-105",
                          brand.imageFit === "contain" ? "object-contain p-8" : "object-cover"
                        )}
                      />
                    </motion.div>
                  </div>

                  <div>
                    <BrandLogo src={brand.logo} name={brand.name} className="mb-5 h-10 w-36" />
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ring-1",
                        theme.badge
                      )}
                    >
                      {brand.tagline}
                    </span>
                    <h3 className="font-display mt-4 text-2xl font-bold text-ink-900 sm:text-3xl">
                      {brand.name}
                    </h3>
                    <p className="mt-4 text-balance leading-relaxed text-ink-500">
                      {brand.description}
                    </p>

                    <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {brand.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm font-medium text-ink-700">
                          <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", theme.check)}>
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Button href="#products" variant="outline" withIcon>
                        View {brand.name} Products
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
