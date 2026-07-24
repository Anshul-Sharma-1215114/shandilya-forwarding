"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { IMAGES } from "@/lib/images";

const CAPTIONS = [
  "Zealup 20L jars, packed and ready",
  "Warehouse stock handling",
  "Organized logistics operations",
  "Retail shelf presence",
  "On-time route delivery",
  "Zealup 20L jars in our warehouse",
  "Supermarket product display",
  "Business partnership & trust",
  "Retail shelf stocking",
  "Distribution operations",
];

const HEIGHT_CLASSES = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-square",
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title="A Glimpse Into Our Operations"
          description="Warehouse handling, delivery fleet, retail presence and everything in between - a look at how we keep the supply chain moving."
          className="mb-16"
        />

        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {IMAGES.gallery.map((src, i) => (
            <motion.button
              key={src + i}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className={`group relative block w-full overflow-hidden rounded-2xl ${HEIGHT_CLASSES[i % HEIGHT_CLASSES.length]} shadow-sm ring-1 ring-ink-900/8`}
            >
              <Image
                src={src}
                alt={CAPTIONS[i % CAPTIONS.length]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/70 via-ink-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="flex items-center gap-1.5 p-3 text-left text-xs font-semibold text-white">
                  <ZoomIn size={13} />
                  {CAPTIONS[i % CAPTIONS.length]}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/90 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={IMAGES.gallery[active]}
                alt={CAPTIONS[active % CAPTIONS.length]}
                fill
                sizes="90vw"
                className="object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/80 to-transparent p-5 text-sm font-semibold text-white">
                {CAPTIONS[active % CAPTIONS.length]}
              </p>
            </motion.div>

            <button
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a === null ? 0 : (a - 1 + IMAGES.gallery.length) % IMAGES.gallery.length));
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a === null ? 0 : (a + 1) % IMAGES.gallery.length));
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
