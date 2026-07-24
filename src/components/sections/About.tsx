"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Link2, Warehouse, Clock, ShieldCheck, HeartHandshake } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { IMAGES } from "@/lib/images";

const ABOUT_POINTS = [
  { icon: BadgeCheck, title: "Authorized Distributor", desc: "Officially appointed partner for Zealup Water, Parle Agro & Balaji Wafers." },
  { icon: Link2, title: "Reliable Distribution", desc: "A dependable network built on consistency and trust." },
  { icon: Warehouse, title: "Strong Supply Chain", desc: "Well-managed warehousing and logistics infrastructure." },
  { icon: Clock, title: "Timely Delivery", desc: "Scheduled dispatches that keep your shelves stocked." },
  { icon: ShieldCheck, title: "Quality Assurance", desc: "Every product handled and stored to preserve quality." },
  { icon: HeartHandshake, title: "Excellent Customer Service", desc: "A responsive team that treats every partner as priority." },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-14">
          {/* Image column */}
          <Reveal direction="left">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5"
              >
                <Image
                  src={IMAGES.about}
                  alt="Shandilya Forwarding warehouse operations"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -bottom-8 -right-6 w-56 rounded-2xl bg-primary-700 p-5 text-white shadow-xl sm:-right-10"
              >
                <p className="font-display text-3xl font-extrabold">100%</p>
                <p className="mt-1 text-xs font-medium text-primary-100">
                  Genuine products, sourced directly from authorized brands
                </p>
              </motion.div>
            </div>
          </Reveal>

          {/* Content column */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title="Building Trusted Supply Chains for India's Favourite Brands"
              description="Shandilya Forwarding supplies beverages and packaged products to wholesalers, retailers, supermarkets, grocery stores, hotels, restaurants, institutions, distributors, and corporate clients. We focus on timely delivery, genuine products, strong distribution, and long-term business relationships."
              className="mb-10"
            />

            <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ABOUT_POINTS.map(({ icon: Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <div className="group flex h-full flex-col gap-3 rounded-2xl border border-ink-900/8 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-ink-900">{title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}
