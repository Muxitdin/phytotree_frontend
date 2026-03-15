'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  Order,
  CreateOrderDto,
  ClickPaymentUrlResponse,
  PaymentStatusResponse,
  OrderStatus,
} from '@/lib/api/types';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from './AuthContext';

interface OrdersContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  // Order operations
  createOrder: (data: CreateOrderDto) => Promise<Order>;
  loadOrders: () => Promise<void>;
  loadMore: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<Order>;

  // Payment operations
  getClickPaymentUrl: (orderId: string) => Promise<ClickPaymentUrlResponse>;
  checkPaymentStatus: (orderId: string) => Promise<PaymentStatusResponse>;

  // Refresh
  refresh: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load orders from API
  const loadOrders = useCallback(async (cursor?: string, append: boolean = false) => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    try {
      if (!append) {
        setIsLoading(true);
      }
      setError(null);

      const response = await ordersApi.getAll({ cursor });

      if (append) {
        setOrders(prev => [...prev, ...response.items]);
      } else {
        setOrders(response.items);
      }

      setNextCursor(response.nextCursor);
      setHasMore(response.nextCursor !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load when user changes
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setOrders([]);
      setNextCursor(null);
      setHasMore(true);
    }
  }, [isAuthenticated, user?.id, loadOrders]);

  // Load more orders (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || !nextCursor) return;
    await loadOrders(nextCursor, true);
  }, [hasMore, isLoading, nextCursor, loadOrders]);

  // Refresh orders
  const refresh = useCallback(async () => {
    setNextCursor(null);
    await loadOrders();
  }, [loadOrders]);

  // Create order
  const createOrder = useCallback(async (data: CreateOrderDto): Promise<Order> => {
    try {
      setIsLoading(true);
      setError(null);

      const order = await ordersApi.create(data);

      // Add new order to the beginning of the list
      setOrders(prev => [order, ...prev]);

      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (id: string): Promise<Order | null> => {
    // First check if we have it loaded
    const cached = orders.find(o => o.id === id);
    if (cached) return cached;

    // Fetch from API
    try {
      const order = await ordersApi.getOne(id);
      return order;
    } catch {
      return null;
    }
  }, [orders]);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: string): Promise<Order> => {
    try {
      setIsLoading(true);
      const order = await ordersApi.cancel(orderId);

      // Update order in the list
      setOrders(prev => prev.map(o => o.id === orderId ? order : o));

      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get Click payment URL
  const getClickPaymentUrl = useCallback(async (orderId: string): Promise<ClickPaymentUrlResponse> => {
    try {
      const response = await ordersApi.getClickPaymentUrl(orderId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get payment URL';
      setError(message);
      throw err;
    }
  }, []);

  // Check payment status
  const checkPaymentStatus = useCallback(async (orderId: string): Promise<PaymentStatusResponse> => {
    try {
      const response = await ordersApi.getPaymentStatus(orderId);

      // Update order in the list if payment status changed
      if (response.isPaid) {
        setOrders(prev => prev.map(o =>
          o.id === orderId
            ? { ...o, status: response.orderStatus as OrderStatus }
            : o
        ));
      }

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check payment status';
      setError(message);
      throw err;
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        hasMore,
        createOrder,
        loadOrders: () => loadOrders(),
        loadMore,
        getOrderById,
        cancelOrder,
        getClickPaymentUrl,
        checkPaymentStatus,
        refresh,
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
