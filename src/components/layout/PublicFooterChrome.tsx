"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import ScrollToTopButton from "./ScrollToTopButton";

/** Hides the marketing footer/WhatsApp/scroll-to-top chrome under /seller. */
export default function PublicFooterChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/seller")) return null;

  return (
    <>
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </>
  );
}
