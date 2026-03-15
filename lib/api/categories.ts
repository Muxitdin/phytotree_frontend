import { api } from './client';
import type { Category, PaginatedResponse } from './types';

export const categoriesApi = {
  /**
   * Get all categories with pagination
   */
  getAll: (params?: { cursor?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();

    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    return api.get<PaginatedResponse<Category>>(
      `/categories${queryString ? `?${queryString}` : ''}`,
      { skipAuth: true }
    );
  },

  /**
   * Get single category by ID or slug
   */
  getOne: (idOrSlug: string) =>
    api.get<Category>(`/categories/${idOrSlug}`, { skipAuth: true }),

  /**
   * Create category (Admin only)
   */
  create: (data: {
    slug: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    imageUrl?: string;
  }) => api.post<Category>('/categories', data),

  /**
   * Update category (Admin only)
   */
  update: (id: string, data: Partial<{
    slug: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    imageUrl: string;
  }>) => api.patch<Category>(`/categories/${id}`, data),

  /**
   * Delete category (Admin only)
   */
  delete: (id: string) => api.delete<void>(`/categories/${id}`),
};
