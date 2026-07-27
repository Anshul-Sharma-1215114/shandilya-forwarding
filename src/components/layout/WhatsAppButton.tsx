"use client";

import { motion } from "framer-motion";
import { COMPANY } from "@/data/nav";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
        COMPANY.whatsappDefaultMessage
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50" />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.393.7 4.62 1.91 6.5L4 29l7.66-1.87a11.94 11.94 0 0 0 4.344.83h.005C22.63 27.96 28 22.583 28 15.955 28 9.328 22.63 3 16.004 3zm0 21.86h-.004a9.9 9.9 0 0 1-5.05-1.386l-.362-.216-3.79.98 1.012-3.694-.236-.38a9.86 9.86 0 0 1-1.514-5.16c0-5.462 4.446-9.908 9.948-9.908 2.656 0 5.15 1.035 7.028 2.916a9.87 9.87 0 0 1 2.912 7.02c0 5.462-4.446 9.828-9.944 9.828zm5.44-7.386c-.298-.15-1.762-.87-2.036-.968-.274-.1-.472-.15-.672.15-.198.298-.77.968-.944 1.166-.174.198-.348.223-.646.075-.298-.15-1.258-.464-2.396-1.48-.886-.79-1.484-1.766-1.658-2.064-.174-.298-.02-.46.13-.61.134-.133.298-.348.446-.522.15-.174.198-.298.298-.497.1-.198.05-.372-.025-.522-.075-.15-.672-1.62-.922-2.22-.242-.582-.488-.503-.672-.512l-.572-.01c-.198 0-.522.075-.795.372-.273.298-1.042 1.018-1.042 2.485s1.067 2.883 1.216 3.082c.15.198 2.1 3.205 5.086 4.494.71.306 1.264.489 1.696.626.712.226 1.36.194 1.872.118.571-.085 1.762-.72 2.01-1.415.248-.696.248-1.293.174-1.416-.075-.124-.273-.198-.571-.348z" />
      </svg>
    </motion.a>
  );
}
