import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Login",
  robots: { index: false, follow: false },
};

export default function SellerAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-dim px-4">
      {children}
    </div>
  );
}
