import { api } from './client';
import type {
  Order,
  CreateOrderDto,
  ClickPaymentUrlResponse,
  PaymentStatusResponse,
  PaginatedResponse,
  OrderStatus,
} from './types';

export const ordersApi = {
  /**
   * Create order from cart
   */
  create: (data: CreateOrderDto) =>
    api.post<Order>('/orders', data),

  /**
   * Get user's orders with pagination
   */
  getAll: (params?: { cursor?: string; status?: OrderStatus }) => {
    const searchParams = new URLSearchParams();

    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    return api.get<PaginatedResponse<Order>>(
      `/orders${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get single order by ID
   */
  getOne: (orderId: string) =>
    api.get<Order>(`/orders/${orderId}`),

  /**
   * Get Click payment URL
   */
  getClickPaymentUrl: (orderId: string) =>
    api.post<ClickPaymentUrlResponse>(`/orders/${orderId}/pay/click`),

  /**
   * Check payment status
   */
  getPaymentStatus: (orderId: string) =>
    api.get<PaymentStatusResponse>(`/orders/${orderId}/payment-status`),

  /**
   * Cancel order
   */
  cancel: (orderId: string) =>
    api.delete<Order>(`/orders/${orderId}`),
};
