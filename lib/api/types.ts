// ============ USER & AUTH ============

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  telegramUserId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  phoneNumber?: string | null;
  role: UserRole;
}

export interface AuthInitResponse {
  authToken: string;
  deepLink: string;
  expiresIn: number;
}

export interface AuthFinalizeResponse {
  accessToken: string;
  user: User;
  expiresIn: number;
}

export interface AuthSession {
  status: 'pending' | 'confirmed' | 'expired';
  user?: User;
}

// ============ CATEGORIES ============

export interface Category {
  id: string;
  slug: string;
  nameRu: string;
  nameEn: string;
  nameUz: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============ PRODUCTS ============

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  category: {
    id: string;
    slug: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
  };
  nameRu: string;
  nameEn: string;
  nameUz: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  descriptionUz: string | null;
  price: string; // Decimal as string
  images: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsQueryParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  categorySlug?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// ============ CART ============

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    slug: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    price: string;
    images: string[];
    inStock: boolean;
    category: {
      id: string;
      slug: string;
      nameRu: string;
      nameEn: string;
      nameUz: string;
    };
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
}

// ============ WISHLIST ============

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    slug: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    price: string;
    images: string[];
    inStock: boolean;
    category: {
      id: string;
      slug: string;
      nameRu: string;
      nameEn: string;
      nameUz: string;
    };
  };
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  totalItems: number;
}

// ============ ORDERS ============

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentProvider = 'CLICK' | 'PAYME' | 'UZCARD';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: {
    id: string;
    slug: string;
    images: string[];
  };
  productName: string;
  productPrice: string;
  quantity: number;
  totalPrice: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: string;
  createdAt: string;
  completeTime: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingNote: string | null;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  status: OrderStatus;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingNote?: string;
}

export interface ClickPaymentUrlResponse {
  paymentUrl: string;
  orderId: string;
  orderNumber: string;
  amount: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  isPaid: boolean;
  payment: {
    id: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    amount: string;
    paidAt: string | null;
  } | null;
}

// ============ PAGINATION ============

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}
