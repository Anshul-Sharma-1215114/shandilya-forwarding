export type WhyItem = {
  title: string;
  description: string;
  icon: "ShieldCheck" | "Truck" | "PackageCheck" | "Network" | "HandCoins" | "Headset" | "BadgeCheck" | "TrendingUp";
};

export const WHY_CHOOSE_US: WhyItem[] = [
  {
    title: "Authorized Distributor",
    description: "Officially appointed distribution partner for Zealup Water, Parle Agro, Balaji Wafers and Campa.",
    icon: "BadgeCheck",
  },
  {
    title: "100% Genuine Products",
    description: "Every product is sourced directly, ensuring complete authenticity and quality on every order.",
    icon: "ShieldCheck",
  },
  {
    title: "Timely Delivery",
    description: "A dependable logistics network ensures your orders reach you on schedule, every time.",
    icon: "Truck",
  },
  {
    title: "Wide Product Portfolio",
    description: "Water, juices, flavoured milk, wafers and namkeen - a complete FMCG range under one roof.",
    icon: "PackageCheck",
  },
  {
    title: "Strong Distribution Network",
    description: "A growing network across retailers, wholesalers, supermarkets and institutions.",
    icon: "Network",
  },
  {
    title: "Competitive Supply",
    description: "Structured supply chain that keeps your business stocked and margins healthy.",
    icon: "HandCoins",
  },
  {
    title: "Business Support",
    description: "Dedicated support for order planning, restocking schedules and account management.",
    icon: "Headset",
  },
  {
    title: "Trusted Partner",
    description: "Long-standing relationships built on reliability, transparency and consistent service.",
    icon: "TrendingUp",
  },
];
