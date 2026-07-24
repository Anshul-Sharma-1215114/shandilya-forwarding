"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductImage from "@/components/ui/ProductImage";
import { PRODUCTS, BRAND_FILTERS, type BrandName } from "@/data/products";
import { COMPANY } from "@/data/nav";
import { cn } from "@/lib/utils";

type Filter = "All" | BrandName;

const BRAND_BADGE: Record<BrandName, string> = {
  "Zealup Water": "bg-primary-50 text-primary-700 ring-primary-200",
  "Parle Agro": "bg-secondary-50 text-secondary-700 ring-secondary-200",
  "Balaji Wafers": "bg-accent-50 text-accent-700 ring-accent-200",
};

function inquiryLink(productName: string) {
  const message = `Hi Shandilya Forwarding, I'd like to enquire about ${productName} for bulk/wholesale supply.`;
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function Products() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.brand === filter)),
    [filter]
  );

  return (
    <section id="products" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Products"
          title="A Complete FMCG Portfolio, Ready for Your Shelves"
          description="Browse our range across water, beverages and namkeen. For pricing, availability and bulk orders, reach out to our team directly — this is a showcase, not an online store."
          className="mb-12"
        />

        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
          {(["All", ...BRAND_FILTERS] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                filter === f
                  ? "bg-primary-700 text-white shadow-[0_8px_20px_-8px_rgba(20,102,63,0.6)]"
                  : "bg-white text-ink-600 ring-1 ring-ink-900/10 hover:text-primary-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-cream-dim">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      name={product.name}
                      accent={product.accent}
                    />
                  </div>
                  <span
                    className={cn(
                      "absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 backdrop-blur",
                      BRAND_BADGE[product.brand]
                    )}
                  >
                    {product.brand}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    {product.category}
                  </p>
                  <h3 className="font-display text-sm font-bold leading-snug text-ink-900">
                    {product.name}
                  </h3>
                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                    {product.description}
                  </p>

                  <a
                    href={inquiryLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary-50 px-3 py-2.5 text-xs font-bold text-primary-700 transition-colors duration-300 hover:bg-primary-600 hover:text-white"
                  >
                    <MessageCircle size={13} />
                    Inquiry
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
