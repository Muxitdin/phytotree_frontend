'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import type { Product, Category, ProductsQueryParams } from '@/lib/api/types';

interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}

interface ProductsContextType {
  // Products
  products: Product[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  // Categories
  categories: Category[];
  categoriesLoading: boolean;

  // Filters
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;

  // Pagination
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;

  // Single product
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Promise<Product | null>;

  // Admin: Product operations
  createProduct: (data: Parameters<typeof productsApi.create>[0]) => Promise<Product>;
  updateProduct: (id: string, data: Parameters<typeof productsApi.update>[1]) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Admin: Category operations
  createCategory: (data: Parameters<typeof categoriesApi.create>[0]) => Promise<Category>;
  updateCategory: (id: string, data: Parameters<typeof categoriesApi.update>[1]) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({});

  // Build query params from filters
  const buildQueryParams = useCallback((cursor?: string): ProductsQueryParams => {
    const params: ProductsQueryParams = {
      limit: 12,
    };

    if (cursor) params.cursor = cursor;
    if (filters.categorySlug) params.categorySlug = filters.categorySlug;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    if (filters.inStock !== undefined) params.inStock = filters.inStock;

    return params;
  }, [filters]);

  // Fetch products
  const fetchProducts = useCallback(async (cursor?: string, append: boolean = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      }
      setError(null);

      const params = buildQueryParams(cursor);
      const response = await productsApi.getAll(params);

      // Handle both response formats: { items: [...] } or { data: [...] }
      const items = (response as any).items || (response as any).data || [];

      if (append) {
        setProducts(prev => Array.isArray(prev) ? [...prev, ...items] : items);
      } else {
        setProducts(items);
      }

      setNextCursor(response.nextCursor);
      setHasMore(response.nextCursor !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoriesApi.getAll({ limit: 100 });

      // Handle both response formats: { items: [...] } or { data: [...] }
      const items = (response as any).items || (response as any).data || [];
      setCategories(items);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reload products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load more products (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || !nextCursor) return;
    await fetchProducts(nextCursor, true);
  }, [hasMore, isLoading, nextCursor, fetchProducts]);

  // Refresh products
  const refresh = useCallback(async () => {
    setNextCursor(null);
    await fetchProducts();
  }, [fetchProducts]);

  // Get product by ID (from loaded products)
  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  // Get product by slug (fetch from API if not in cache)
  const getProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    // First check if we have it loaded
    const cached = products.find(p => p.slug === slug || p.id === slug);
    if (cached) return cached;

    // Fetch from API
    try {
      const product = await productsApi.getOne(slug);
      return product;
    } catch {
      return null;
    }
  }, [products]);

  // Admin: Create product
  const createProduct = useCallback(async (
    data: Parameters<typeof productsApi.create>[0]
  ): Promise<Product> => {
    const newProduct = await productsApi.create(data);
    setProducts(prev => Array.isArray(prev) ? [newProduct, ...prev] : [newProduct]);
    return newProduct;
  }, []);

  // Admin: Update product
  const updateProduct = useCallback(async (
    id: string,
    data: Parameters<typeof productsApi.update>[1]
  ): Promise<Product> => {
    const updated = await productsApi.update(id, data);
    setProducts(prev => Array.isArray(prev) ? prev.map(p => p.id === id ? updated : p) : [updated]);
    return updated;
  }, []);

  // Admin: Delete product
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await productsApi.delete(id);
    setProducts(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : []);
  }, []);

  // Admin: Create category
  const createCategory = useCallback(async (
    data: Parameters<typeof categoriesApi.create>[0]
  ): Promise<Category> => {
    const newCategory = await categoriesApi.create(data);
    setCategories(prev => Array.isArray(prev) ? [...prev, newCategory] : [newCategory]);
    return newCategory;
  }, []);

  // Admin: Update category
  const updateCategory = useCallback(async (
    id: string,
    data: Parameters<typeof categoriesApi.update>[1]
  ): Promise<Category> => {
    const updated = await categoriesApi.update(id, data);
    setCategories(prev => Array.isArray(prev) ? prev.map(c => c.id === id ? updated : c) : [updated]);
    return updated;
  }, []);

  // Admin: Delete category
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    await categoriesApi.delete(id);
    setCategories(prev => Array.isArray(prev) ? prev.filter(c => c.id !== id) : []);
  }, []);

  // Refresh categories
  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        hasMore,
        categories,
        categoriesLoading,
        filters,
        setFilters,
        loadMore,
        refresh,
        getProductById,
        getProductBySlug,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
