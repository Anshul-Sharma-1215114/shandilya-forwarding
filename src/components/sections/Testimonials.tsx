"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const testimonial = TESTIMONIALS[index];

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Business Partners Say"
          description="Real feedback from retailers, wholesalers and institutions we work with every day."
          className="mb-16"
        />

        <div className="relative mx-auto max-w-3xl">
          <span className="absolute -left-2 -top-6 text-primary-100 sm:-left-8">
            <Quote size={80} fill="currentColor" strokeWidth={0} />
          </span>

          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-[2rem] border border-ink-900/8 bg-surface p-8 shadow-lg sm:p-10"
              >
                <p className="text-balance text-lg leading-relaxed text-ink-700 sm:text-xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink-900">{testimonial.name}</p>
                    <p className="text-xs text-ink-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-surface text-ink-600 shadow-sm transition-all hover:border-primary-600 hover:text-primary-700 hover:shadow-md"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-primary-600" : "w-2 bg-ink-900/15 hover:bg-ink-900/30"
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-surface text-ink-600 shadow-sm transition-all hover:border-primary-600 hover:text-primary-700 hover:shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
