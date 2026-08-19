import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooterChrome from "@/components/layout/PublicFooterChrome";

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
      "Shandilya Forwarding | Authorized Distributor of Zealup Water, Parle Agro, Balaji Wafers & Campa",
    template: "%s | Shandilya Forwarding",
  },
  description:
    "Shandilya Forwarding is an authorized distributor of Zealup Water, Parle Agro, Balaji Wafers and Campa products, supplying retailers, wholesalers, supermarkets, hotels, restaurants and institutions with genuine products and reliable, on-time delivery.",
  keywords: [
    "Shandilya Forwarding",
    "Zealup Water distributor",
    "Parle Agro distributor",
    "Balaji Wafers distributor",
    "Campa distributor",
    "FMCG distributor",
    "wholesale beverages",
    "dealership",
    "bulk supply",
  ],
  openGraph: {
    title:
      "Shandilya Forwarding | Authorized Distributor of Zealup Water, Parle Agro, Balaji Wafers & Campa",
    description:
      "Trusted distribution partner supplying genuine Zealup Water, Parle Agro, Balaji Wafers and Campa products to retailers, wholesalers, hotels and institutions.",
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
        {/*
          Runs before hydration so an explicit stored preference wins over
          the OS default on first paint - no flash of the wrong theme.
          Silent no-op when nothing's stored yet (the CSS media query
          already handles that "system" case on its own).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooterChrome />
      </body>
    </html>
  );
}
