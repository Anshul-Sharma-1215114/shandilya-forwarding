"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

/** Hides the marketing navbar under /seller, which has its own sidebar shell. */
export default function PublicNavbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/seller")) return null;
  return <Navbar />;
}
