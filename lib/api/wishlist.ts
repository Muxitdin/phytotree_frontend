import { api } from './client';
import type { WishlistItem, WishlistResponse } from './types';

export const wishlistApi = {
  /**
   * Get current user's wishlist
   */
  get: () => api.get<WishlistResponse>('/wishlist'),

  /**
   * Get wishlist item count
   */
  getCount: () => api.get<{ count: number }>('/wishlist/count'),

  /**
   * Check if product is in wishlist
   */
  check: (productId: string) =>
    api.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`),

  /**
   * Add product to wishlist
   */
  add: (productId: string) =>
    api.post<WishlistItem>(`/wishlist/${productId}`),

  /**
   * Remove product from wishlist
   */
  remove: (productId: string) =>
    api.delete<void>(`/wishlist/${productId}`),

  /**
   * Clear entire wishlist
   */
  clear: () => api.delete<void>('/wishlist'),
};
