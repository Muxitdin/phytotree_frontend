'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Order, OrderItem, ShippingAddress, CartItem } from '@/lib/types';
import { useAuth } from './AuthContext';

interface OrdersContextType {
  orders: Order[];
  userOrders: Order[];
  createOrder: (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    subtotal: number,
    shipping: number,
    total: number
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'phytotree-orders';

function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const userOrders = orders.filter((order) => order.userId === user?.id);

  const createOrder = (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    subtotal: number,
    shipping: number,
    total: number
  ): Order => {
    if (!user) {
      throw new Error('User must be authenticated to create an order');
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.id,
      productName: item.name,
      productBrand: item.brand,
      price: item.price,
      quantity: item.quantity,
      imageColor: item.imageColor,
    }));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']): void => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        userOrders,
        createOrder,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
