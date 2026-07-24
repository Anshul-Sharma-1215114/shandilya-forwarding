"use client";

import {
  Store,
  Warehouse,
  ShoppingBasket,
  Hotel,
  UtensilsCrossed,
  Building2,
  Briefcase,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { NETWORK_NODES } from "@/data/network";
import { COMPANY } from "@/data/nav";

const ICONS: Record<string, LucideIcon> = {
  Store,
  Warehouse,
  ShoppingBasket,
  Hotel,
  UtensilsCrossed,
  Building2,
  Briefcase,
  Truck,
};

// Fixed percentage centers of a 3x3 grid, skipping the center cell (the hub).
const NODE_POSITIONS = [
  [16.67, 16.67],
  [50, 16.67],
  [83.33, 16.67],
  [16.67, 50],
  [83.33, 50],
  [16.67, 83.33],
  [50, 83.33],
  [83.33, 83.33],
];

export default function DistributionNetwork() {
  return (
    <section id="distribution-network" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Distribution Network"
          title="One Hub, Connected to Every Corner of Your Business"
          description="From neighborhood retail stores to large institutional clients, our distribution network keeps genuine products flowing reliably to every partner."
          className="mb-16"
        />

        {/* Desktop: radial hub-and-spoke */}
        <div className="relative mx-auto hidden aspect-square max-w-2xl lg:block">
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            {NODE_POSITIONS.map(([x, y], i) => (
              <motion.line
                key={i}
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke="var(--color-primary-300)"
                strokeWidth={0.5}
                strokeDasharray="2 2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.08, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-center text-white shadow-[0_20px_50px_-12px_rgba(20,102,63,0.55)]"
          >
            <Truck size={26} />
            <p className="mt-2 px-4 text-[11px] font-bold leading-tight">{COMPANY.name}</p>
          </motion.div>

          {NETWORK_NODES.map((node, i) => {
            const Icon = ICONS[node.icon];
            const [x, y] = NODE_POSITIONS[i];
            return (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-lg ring-1 ring-ink-900/8"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                  <Icon size={16} />
                </span>
                <p className="text-[11px] font-bold leading-tight text-ink-800">{node.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile / tablet: simple grid */}
        <div className="lg:hidden">
          <div className="mx-auto mb-8 flex max-w-xs flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center text-white shadow-lg">
            <Truck size={24} />
            <p className="text-sm font-bold">{COMPANY.name}</p>
            <p className="text-xs text-primary-100">Central Distribution Hub</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {NETWORK_NODES.map((node) => {
              const Icon = ICONS[node.icon];
              return (
                <div
                  key={node.label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-ink-900/8"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                    <Icon size={16} />
                  </span>
                  <p className="text-[11px] font-bold leading-tight text-ink-800">{node.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
