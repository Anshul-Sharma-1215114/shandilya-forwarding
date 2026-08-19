export type NetworkNode = {
  label: string;
  icon: "Store" | "Warehouse" | "ShoppingBasket" | "Hotel" | "UtensilsCrossed" | "Building2" | "Briefcase" | "Truck";
};

export const NETWORK_NODES: NetworkNode[] = [
  { label: "Retail Stores", icon: "Store" },
  { label: "Wholesalers", icon: "Warehouse" },
  { label: "Supermarkets", icon: "ShoppingBasket" },
  { label: "Hotels", icon: "Hotel" },
  { label: "Restaurants", icon: "UtensilsCrossed" },
  { label: "Institutions", icon: "Building2" },
  { label: "Corporate Clients", icon: "Briefcase" },
  { label: "Distributors", icon: "Truck" },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Manufacturer",
    description: "Genuine products sourced directly from Zealup Water, Parle Agro, Balaji Wafers and Campa.",
    icon: "Factory" as const,
  },
  {
    step: "02",
    title: "Warehouse",
    description: "Stocked and quality-checked at our distribution warehouse, ready for dispatch.",
    icon: "Warehouse" as const,
  },
  {
    step: "03",
    title: "Distribution",
    description: "Organized fleet and route planning ensures efficient, on-time movement of stock.",
    icon: "Truck" as const,
  },
  {
    step: "04",
    title: "Retailers",
    description: "Delivered to retailers, wholesalers, hotels, restaurants and institutions.",
    icon: "Store" as const,
  },
  {
    step: "05",
    title: "Customers",
    description: "Fresh, genuine products reach end consumers with consistent quality.",
    icon: "Users" as const,
  },
];
