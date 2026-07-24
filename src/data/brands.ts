import { IMAGES } from "@/lib/images";

export type Brand = {
  slug: "zealup-water" | "parle-agro" | "balaji-wafers";
  name: string;
  tagline: string;
  description: string;
  points: string[];
  image: string;
  imageFit?: "cover" | "contain";
  logo?: string;
  theme: "primary" | "secondary" | "accent";
};

export const BRANDS: Brand[] = [
  {
    slug: "zealup-water",
    name: "Zealup Water",
    tagline: "Premium Packaged Drinking Water",
    description:
      "Zealup is a premium packaged drinking water brand, RO-purified and enriched with balanced minerals for instant hydration. Available across 20L jars, 1L and 500ml bottles, Zealup is trusted by households, offices, hotels and institutions for consistent purity and taste.",
    points: [
      "BIS Certified & RO Purified",
      "Balanced Mineral Content",
      "Available in Multiple Pack Sizes",
      "Trusted for Home, Office & Institutional Use",
    ],
    image: IMAGES.zealupBrand,
    imageFit: "contain",
    logo: "/images/logo/zealup-logo.png",
    theme: "primary",
  },
  {
    slug: "parle-agro",
    name: "Parle Agro",
    tagline: "India's Favourite Beverage House",
    description:
      "Parle Agro is one of India's most loved beverage companies, home to iconic brands like Frooti, Appy Fizz and Smoodh. Their portfolio spans fruit-juice based drinks and flavoured milk products, enjoyed by millions of consumers across the country every single day.",
    points: [
      "Iconic, Nationally Trusted Brand",
      "Wide Range of Juices & Flavoured Milk",
      "Consistent Quality & Taste",
      "High Consumer Demand & Fast Turnover",
    ],
    image: IMAGES.parleAgroBrand,
    logo: "/images/logo/parle-agro-logo.png",
    theme: "secondary",
  },
  {
    slug: "balaji-wafers",
    name: "Balaji Wafers",
    tagline: "India's Most Loved Namkeen & Wafers",
    description:
      "Balaji Wafers is one of India's largest and most trusted snack food brands, known for its crunchy potato wafers and authentic namkeen range. From Simply Salted to Masala Masti and an extensive namkeen line-up, Balaji products are a staple on retail shelves nationwide.",
    points: [
      "India's Leading Namkeen & Wafers Brand",
      "Wide Flavour & Product Portfolio",
      "High Shelf Turnover, Strong Demand",
      "Loved Across Every Age Group",
    ],
    image: IMAGES.balajiBrand,
    imageFit: "contain",
    logo: "/images/logo/balaji-logo.png",
    theme: "accent",
  },
];
