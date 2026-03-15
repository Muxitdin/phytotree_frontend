// Re-export API types
export type {
  User,
  UserRole,
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentProvider,
  Payment,
} from './api/types';

// Local types used by frontend components

export interface PriceRange {
  min: number | null;
  max: number | null;
}

// Legacy types for backward compatibility (will be removed after full migration)

export interface LegacyProduct {
  id: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  imageColor: string;
}

export interface LegacyCartItem extends LegacyProduct {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface LegacyOrderItem {
  productId: string;
  productName: string;
  productBrand: string;
  price: number;
  quantity: number;
  imageColor: string;
}

export interface LegacyOrder {
  id: string;
  userId: string;
  items: LegacyOrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
