"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/data/nav";

const INQUIRY_TYPES = ["Dealership", "Wholesale Supply", "Institutional Supply", "Bulk Order", "Other"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's Start a Business Conversation"
          description="Whether you're looking for dealership, wholesale supply, or bulk institutional orders — our team is ready to help."
          className="mb-16"
        />

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Info column */}
          <Reveal direction="left" className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-primary-700 to-primary-900 p-7 text-white shadow-lg">
                <p className="font-display text-lg font-bold">{COMPANY.name}</p>
                <p className="mt-1 text-sm text-primary-100">
                  Authorized Distributor - Zealup Water, Parle Agro &amp; Balaji Wafers
                </p>

                <div className="mt-7 flex flex-col gap-4">
                  <a href={COMPANY.phoneHref} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Phone size={16} />
                    </span>
                    {COMPANY.phone}
                  </a>
                  <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Mail size={16} />
                    </span>
                    {COMPANY.email}
                  </a>
                  <div className="flex items-start gap-3 text-sm font-medium">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <MapPin size={16} />
                    </span>
                    <span className="leading-relaxed">{COMPANY.address}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                    "Hi Shandilya Forwarding, I'd like to enquire about dealership / bulk supply."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle size={17} />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-[1.75rem] shadow-lg ring-1 ring-ink-900/8">
                <iframe
                  src={COMPANY.mapsEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[220px] w-full border-0 grayscale-[20%]"
                  title="Business location map"
                />
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal direction="right" className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white p-7 shadow-lg sm:p-9">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[380px] flex-col items-center justify-center text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <CheckCircle2 size={32} />
                    </span>
                    <h3 className="font-display mt-5 text-xl font-bold text-ink-900">
                      Thank You for Reaching Out!
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                      We&apos;ve received your inquiry. Our business development team will get in
                      touch with you shortly.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full Name" id="name" placeholder="Your name" required />
                      <Field label="Business Name" id="business" placeholder="Your company" required />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Phone Number" id="phone" type="tel" placeholder="+91 00000 00000" required />
                      <Field label="Email Address" id="email" type="email" placeholder="you@company.com" required />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="inquiryType" className="text-xs font-bold uppercase tracking-wide text-ink-500">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        required
                        defaultValue=""
                        className="rounded-xl border border-ink-900/12 bg-cream px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-500"
                      >
                        <option value="" disabled>
                          Select inquiry type
                        </option>
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-ink-500">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        placeholder="Tell us about your business and requirement..."
                        className="resize-none rounded-xl border border-ink-900/12 bg-cream px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-500"
                      />
                    </div>

                    <Button type="submit" size="lg" variant="primary" withIcon className="mt-2 self-start">
                      Submit Inquiry
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wide text-ink-500">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-ink-900/12 bg-cream px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-500"
      />
    </div>
  );
}
