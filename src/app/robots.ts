import type { MetadataRoute } from "next";

const siteUrl = "https://www.shandilyaforwarding.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/seller", "/api"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
