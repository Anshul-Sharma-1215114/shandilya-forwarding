"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, PackageCheck, Truck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { IMAGES } from "@/lib/images";
import { BRANDS } from "@/data/brands";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44"
    >
      {/* Ambient background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary-200/50 blur-[100px] animate-float-slow" />
        <div className="absolute -right-16 top-40 h-96 w-96 rounded-full bg-secondary-200/50 blur-[110px] animate-float" />
        <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-accent-100/40 blur-[100px]" />
        <div className="grain-overlay" />
      </div>

      <Container>
        <Reveal>
          <h1 className="font-display mb-14 text-balance text-center text-4xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] text-ink-900 sm:mb-16 sm:text-5xl lg:text-6xl xl:text-7xl">
            Shandilya <span className="text-primary-700">Forwarding</span>
          </h1>
        </Reveal>

        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Left: copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 shadow-sm ring-1 ring-primary-200/70 backdrop-blur">
                <BadgeCheck size={15} />
                Authorized Distribution Partner
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
                Trusted Distribution Partner for{" "}
                <span className="relative inline-block text-primary-700">
                  Zealup Water,
                </span>{" "}
                <span className="relative inline-block text-secondary-600">Parle Agro</span>{" "}
                &amp; <span className="relative inline-block text-accent-600">Balaji Wafers</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-500 sm:text-lg">
                Delivering trusted beverages and FMCG products to retailers, wholesalers,
                supermarkets, hotels, restaurants, institutions, and distributors with
                reliability and efficiency.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="#products" size="lg" variant="primary" withIcon>
                  Explore Products
                </Button>
                <Button href="#contact" size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-ink-900/10 pt-8">
                {[
                  { icon: PackageCheck, label: "100% Genuine Products" },
                  { icon: Truck, label: "Reliable, On-Time Delivery" },
                  { icon: BadgeCheck, label: "3 Trusted FMCG Brands" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-200/70">
                      <Icon size={16} />
                    </span>
                    <span className="text-sm font-semibold text-ink-700">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: visual collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(20,32,20,0.35)] ring-1 ring-black/5"
            >
              <Image
                src={IMAGES.heroDelivery}
                alt="Shandilya Forwarding branded delivery truck"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-[78%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
            </motion.div>

            {/* Floating card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-6 top-8 w-44 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur animate-float sm:-left-10"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <BadgeCheck size={16} />
                </span>
                <p className="text-xs font-bold text-ink-900">Authorized Distributor</p>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-ink-500">
                Genuine, verified FMCG supply chain
              </p>
            </motion.div>

            {/* Floating card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-4 bottom-10 w-48 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur animate-float-slow sm:-right-10"
            >
              <div className="flex -space-x-2">
                {BRANDS.map((b) => (
                  <span
                    key={b.slug}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-cream ring-2 ring-white text-[10px] font-bold text-ink-700 shadow-sm"
                    title={b.name}
                  >
                    {b.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs font-bold text-ink-900">3 Leading FMCG Brands</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-500">
                Water • Beverages • Namkeen
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Marquee strip */}
      <div className="relative mt-20 overflow-hidden border-y border-ink-900/8 bg-white/50 py-4 backdrop-blur-sm">
        <div className="flex w-max animate-marquee gap-16">
          {Array.from({ length: 2 }).flatMap((_, dup) =>
            [
              "Zealup Water",
              "Parle Agro",
              "Balaji Wafers",
              "Retailers",
              "Wholesalers",
              "Supermarkets",
              "Hotels & Restaurants",
              "Institutions",
            ].map((label, i) => (
              <span
                key={`${dup}-${label}-${i}`}
                className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-400"
              >
                {label}
                <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
