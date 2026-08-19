// Local mirror of the Shandilya Mobile backend's JSON shapes
// (d:/shandilya-mobile/apps/backend). parle and shandilya-mobile are
// separate repos/deployables (see project convention: no shared workspace
// between them), so these types are duplicated here rather than imported -
// standard for a client of an external API.

export type UserRole = "customer" | "admin" | "seller" | "delivery_partner";

export type SellerUser = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  lat: number | null;
  lng: number | null;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  unitPriceInPaise: number;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: "razorpay" | "cod";
  // COD payments have no Razorpay order to reference.
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amountInPaise: number;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
} | null;

export type OrderStatus =
  | "pending_payment"
  | "placed"
  | "confirmed"
  | "preparing"
  | "packed"
  | "ready_for_pickup"
  | "accepted"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderTimelineEvent = {
  id: string;
  orderId: string;
  actorUserId: string;
  event: string;
  remarks: string | null;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  totalInPaise: number;
  discountInPaise: number;
  deliveryPartnerId: string | null;
  acceptedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: Payment;
  deliveryAddress: Address;
  user: SellerUser;
  timeline?: OrderTimelineEvent[];
};

export type Brand = "ZEALUP_WATER" | "PARLE_AGRO" | "BALAJI_WAFERS" | "ICE_CUBE" | "CAMPA";

export const BRAND_LABELS: Record<Brand, string> = {
  CAMPA: "Campa",
  PARLE_AGRO: "Parle Agro",
  BALAJI_WAFERS: "Balaji Wafers",
  ICE_CUBE: "In-House",
  ZEALUP_WATER: "Zealup Water",
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: Brand;
  category: string;
  imageUrl: string | null;
  priceInPaise: number;
  unit: string;
  packSize: number;
  stockQty: number;
  active: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CouponType = "percentage" | "flat" | "free_delivery";

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  minOrderInPaise: number;
  maxDiscountInPaise: number | null;
  maxUses: number | null;
  perUserLimit: number | null;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StoreStatus = {
  isOpen: boolean;
  reason: "open" | "closed_manual" | "closed_hours" | "opening_soon" | "closing_soon";
  openTime: string;
  closeTime: string;
  timezone: string;
};

export type DeliveryPartner = {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  vehicleType: string | null;
  vehicleNumber: string | null;
  emergencyContact: string | null;
  lastKnownLat: number | null;
  lastKnownLng: number | null;
  locationUpdatedAt: string | null;
  activeOrder: { id: string; status: string } | null;
};

export type DeliveryLocation = { lat: number | null; lng: number | null; updatedAt: string | null };

export type AuditLogEntry = {
  id: string;
  actorUserId: string;
  actor: { id: string; name: string };
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  createdAt: string;
};
