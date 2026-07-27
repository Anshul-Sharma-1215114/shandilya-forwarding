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
  { label: "Contact", href: "#contact" },
];

export const COMPANY = {
  name: "Shandilya Forwarding",
  tagline: "Authorized Distributor of Zealup Water & Parle Agro Products",
  phone: "+91 99934 41607",
  phoneHref: "tel:9993441607",
  whatsapp: "919993441607",
  whatsappDefaultMessage: "Hi Shandilya Forwarding, I'd like to enquire about bulk supply.",
  email: "info@shandilyaforwarding.com",
  address: "Near Mouza Banarsi, Mana, VIP Road, Raipur, C.G.",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Near Mouza Banarsi, Mana, VIP Road, Raipur, C.G.") +
    "&output=embed",
  instagram: "https://www.instagram.com/shandilyaforwarding/",
  facebook: "https://www.facebook.com/profile.php?id=61592404801093",
};
