export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  imageColor: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PriceRange {
  min: number | null;
  max: number | null;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productBrand: string;
  price: number;
  quantity: number;
  imageColor: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
