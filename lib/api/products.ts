import { api } from './client';
import type { Product, ProductsQueryParams, PaginatedResponse } from './types';

export const productsApi = {
  /**
   * Get products with pagination and filters
   */
  getAll: (params?: ProductsQueryParams) => {
    const searchParams = new URLSearchParams();

    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.categorySlug) searchParams.set('categorySlug', params.categorySlug);
    if (params?.inStock !== undefined) searchParams.set('inStock', params.inStock.toString());
    if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.search) searchParams.set('search', params.search);

    const queryString = searchParams.toString();
    return api.get<PaginatedResponse<Product>>(
      `/products${queryString ? `?${queryString}` : ''}`,
      { skipAuth: true }
    );
  },

  /**
   * Get single product by ID or slug
   */
  getOne: (idOrSlug: string) =>
    api.get<Product>(`/products/${idOrSlug}`, { skipAuth: true }),

  /**
   * Create product (Admin only)
   */
  create: (data: {
    slug: string;
    categoryId: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    descriptionRu?: string;
    descriptionEn?: string;
    descriptionUz?: string;
    price: number;
    images?: string[];
    inStock?: boolean;
  }) => api.post<Product>('/products', data),

  /**
   * Update product (Admin only)
   */
  update: (id: string, data: Partial<{
    slug: string;
    categoryId: string;
    nameRu: string;
    nameEn: string;
    nameUz: string;
    descriptionRu: string;
    descriptionEn: string;
    descriptionUz: string;
    price: number;
    images: string[];
    inStock: boolean;
  }>) => api.patch<Product>(`/products/${id}`, data),

  /**
   * Delete product (Admin only)
   */
  delete: (id: string) => api.delete<void>(`/products/${id}`),
};
