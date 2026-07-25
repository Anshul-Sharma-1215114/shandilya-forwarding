export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Brands", href: "#brands" },
  { label: "Products", href: "#products" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Distribution", href: "#distribution-network" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export const COMPANY = {
  name: "Shandilya Forwarding",
  tagline: "Authorized Distributor of Zealup Water & Parle Agro Products",
  phone: "+91 93001 04104",
  phoneHref: "tel:9300104104",
  whatsapp: "919300104104",
  email: "info@shandilyaforwarding.com",
  address: "Near Mouza Banarsi, Mana, VIP Road, Raipur, C.G.",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Near Mouza Banarsi, Mana, VIP Road, Raipur, C.G.") +
    "&output=embed",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
};
