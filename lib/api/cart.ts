import { api } from './client';
import type { CartItem, CartResponse } from './types';

export const cartApi = {
  /**
   * Get current user's cart
   */
  get: () => api.get<CartResponse>('/cart'),

  /**
   * Get cart item count
   */
  getCount: () => api.get<{ count: number }>('/cart/count'),

  /**
   * Add item to cart
   */
  addItem: (productId: string, quantity: number = 1) =>
    api.post<CartItem>('/cart/items', { productId, quantity }),

  /**
   * Update cart item quantity
   */
  updateItem: (productId: string, quantity: number) =>
    api.patch<CartItem>(`/cart/items/${productId}`, { quantity }),

  /**
   * Remove item from cart
   */
  removeItem: (productId: string) =>
    api.delete<void>(`/cart/items/${productId}`),

  /**
   * Clear entire cart
   */
  clear: () => api.delete<void>('/cart'),
};
