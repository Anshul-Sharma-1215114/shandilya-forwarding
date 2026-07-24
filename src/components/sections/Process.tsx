"use client";

import { Factory, Warehouse, Truck, Store, Users, type LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/data/network";

const ICONS: Record<string, LucideIcon> = { Factory, Warehouse, Truck, Store, Users };

export default function Process() {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="From Manufacturer to Customer, Every Step Accounted For"
          description="A streamlined flow that keeps products moving efficiently, from source to shelf."
          className="mb-16"
        />

        <div className="relative">
          {/* connecting line - desktop */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 md:block"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5 md:gap-4">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(28,32,25,0.25)] ring-4 ring-cream">
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
                      {step.step}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="font-display mt-5 text-base font-bold text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[13rem] text-xs leading-relaxed text-ink-500">
                    {step.description}
                  </p>

                  {i < PROCESS_STEPS.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="absolute -right-3 top-8 hidden text-ink-300 md:block"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
