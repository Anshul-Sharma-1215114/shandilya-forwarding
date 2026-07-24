export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ramesh Gupta",
    role: "Owner, Gupta General Store",
    quote:
      "Shandilya Forwarding has been supplying us for over two years now. Deliveries are always on time and the products are 100% genuine. Never had a single issue with stock quality.",
    initials: "RG",
  },
  {
    name: "Anita Sharma",
    role: "Purchase Manager, Sunrise Supermarket",
    quote:
      "What stands out is their reliability. Whether it's Zealup Water or Parle Agro beverages, our shelves are never empty thanks to their consistent restocking schedule.",
    initials: "AS",
  },
  {
    name: "Vikram Rao",
    role: "F&B Head, Grand Plaza Hotel",
    quote:
      "As a hotel, we need bulk supply we can depend on. Their team understands institutional requirements and always delivers exactly what we need, when we need it.",
    initials: "VR",
  },
  {
    name: "Priya Menon",
    role: "Wholesaler, Menon Distributors",
    quote:
      "Great business partner - transparent pricing, wide product range, and a support team that actually picks up the phone. Highly recommend for bulk orders.",
    initials: "PM",
  },
];
