"use client";

import { motion } from "framer-motion";
import { Megaphone, TrendingUp, Handshake, Store } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";

const BENEFITS = [
  { icon: TrendingUp, label: "Boost Brand Visibility" },
  { icon: Store, label: "Reach Retailers & Wholesalers" },
  { icon: Handshake, label: "Simple, Personal Onboarding" },
];

export default function AdvertiseWithUs() {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-ink-900/8 bg-white/70 p-8 shadow-sm sm:p-10 lg:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-secondary-200/40 blur-[100px]" />
          <div aria-hidden className="absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-primary-200/40 blur-[100px]" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Copy column */}
            <div>
              <SectionHeading
                align="left"
                eyebrow="Advertising Opportunities"
                title="Advertise With Us"
                description="Looking to showcase your products to a wider audience? Shandilya Forwarding offers businesses the opportunity to advertise their products on our website and increase their brand visibility."
                theme="secondary"
              />

              <div className="mt-6 flex flex-col gap-4 text-balance leading-relaxed text-ink-500">
                <p>
                  Whether you&apos;re a manufacturer, distributor, retailer, or an emerging
                  brand, we would love to collaborate with you. Promote your products
                  through our platform and connect with potential customers.
                </p>
                <p>
                  If you&apos;re interested in advertising or partnering with us, feel free
                  to reach out. Our team will be happy to discuss the best promotional
                  opportunities for your business.
                </p>
              </div>

              <StaggerGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {BENEFITS.map(({ icon: Icon, label }) => (
                  <StaggerItem key={label}>
                    <div className="flex h-full items-center gap-2.5 rounded-xl border border-ink-900/8 bg-surface px-4 py-3 shadow-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                        <Icon size={15} />
                      </span>
                      <span className="text-xs font-semibold text-ink-700">{label}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              <Reveal delay={0.1} className="mt-9">
                <Button href="#contact" size="lg" variant="secondary" withIcon>
                  Advertise With Us
                </Button>
              </Reveal>
            </div>

            {/* Illustration column */}
            <Reveal direction="left" className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-[2rem] bg-gradient-to-br from-secondary-500 to-secondary-700 shadow-[0_30px_70px_-25px_rgba(250,124,20,0.5)]"
              >
                <span
                  aria-hidden
                  className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 text-white animate-float-slow"
                >
                  <Megaphone size={52} strokeWidth={1.5} />
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.55 }}
                  className="absolute -bottom-6 left-1/2 w-64 -translate-x-1/2 rounded-2xl bg-surface p-4 text-center shadow-xl ring-1 ring-black/5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                    Open to
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink-900">
                    Manufacturers &middot; Distributors &middot; Retailers &middot; Emerging Brands
                  </p>
                </motion.div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
