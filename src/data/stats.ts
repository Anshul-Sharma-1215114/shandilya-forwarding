export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: 1000, suffix: "+", label: "Retail Partners" },
  { value: 500, suffix: "+", label: "Successful Deliveries" },
  { value: 50, suffix: "+", label: "Distribution Areas" },
  { value: 100, suffix: "+", label: "Products" },
];
