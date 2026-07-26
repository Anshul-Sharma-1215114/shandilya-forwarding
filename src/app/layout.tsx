import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://www.shandilyaforwarding.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Shandilya Forwarding | Authorized Distributor of Zealup Water, Parle Agro & Balaji Wafers",
    template: "%s | Shandilya Forwarding",
  },
  description:
    "Shandilya Forwarding is an authorized distributor of Zealup Water, Parle Agro and Balaji Wafers products, supplying retailers, wholesalers, supermarkets, hotels, restaurants and institutions with genuine products and reliable, on-time delivery.",
  keywords: [
    "Shandilya Forwarding",
    "Zealup Water distributor",
    "Parle Agro distributor",
    "Balaji Wafers distributor",
    "FMCG distributor",
    "wholesale beverages",
    "dealership",
    "bulk supply",
  ],
  openGraph: {
    title:
      "Shandilya Forwarding | Authorized Distributor of Zealup Water, Parle Agro & Balaji Wafers",
    description:
      "Trusted distribution partner supplying genuine Zealup Water, Parle Agro and Balaji Wafers products to retailers, wholesalers, hotels and institutions.",
    url: siteUrl,
    siteName: "Shandilya Forwarding",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink-800">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
