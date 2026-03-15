'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/api/cart';
import { productsApi } from '@/lib/api/products';
import type { Product, CartItem as APICartItem, CartResponse } from '@/lib/api/types';
import { getProductPrice } from '@/lib/product-helpers';

// Local cart item for guests
interface LocalCartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: LocalCartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, delta: number) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartItemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'phytotree-cart';

// Helper to convert API cart item to local format
function apiToLocalItem(item: APICartItem): LocalCartItem {
  return {
    productId: item.productId,
    product: item.product as unknown as Product,
    quantity: item.quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Helper to refresh product data from API
  const refreshProductData = async (items: LocalCartItem[]): Promise<LocalCartItem[]> => {
    if (items.length === 0) return items;

    try {
      // Fetch fresh product data for each item
      const refreshedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const freshProduct = await productsApi.getOne(item.productId);
            return {
              ...item,
              product: freshProduct,
            };
          } catch (error) {
            console.error(`Failed to refresh product ${item.productId}:`, error);
            // Keep old product data if fetch fails
            return item;
          }
        })
      );

      // Filter out items where the product no longer exists or is out of stock
      return refreshedItems.filter(item => item.product && item.product.inStock !== false);
    } catch (error) {
      console.error('Failed to refresh product data:', error);
      return items;
    }
  };

  // Load cart from localStorage (for guests) or API (for authenticated users)
  const loadCart = useCallback(async () => {
    setIsLoading(true);

    if (isAuthenticated) {
      // Load from API
      try {
        const response = await cartApi.get();
        // Convert to local format and filter out out-of-stock items
        const items = response.items
          .map(apiToLocalItem)
          .filter(item => item.product && item.product.inStock !== false);
        setCartItems(items);
      } catch (error) {
        console.error('Failed to load cart from API:', error);
        // Fall back to localStorage
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          try {
            const parsedItems = JSON.parse(saved);
            // Refresh product data to get current prices
            const refreshedItems = await refreshProductData(parsedItems);
            setCartItems(refreshedItems);
          } catch (e) {
            console.error('Failed to parse cart from localStorage');
          }
        }
      }
    } else {
      // Load from localStorage
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          const parsedItems = JSON.parse(saved);
          // Refresh product data to get current prices
          const refreshedItems = await refreshProductData(parsedItems);
          setCartItems(refreshedItems);
          // Save refreshed data back to localStorage
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(refreshedItems));
        } catch (e) {
          console.error('Failed to parse cart from localStorage');
        }
      }
    }

    setIsLoading(false);
    setIsHydrated(true);
  }, [isAuthenticated]);

  // Initial load
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sync local cart to API when user logs in
  useEffect(() => {
    if (isAuthenticated && isHydrated && cartItems.length > 0) {
      // Sync local cart items to API
      const syncLocalToAPI = async () => {
        for (const item of cartItems) {
          try {
            await cartApi.addItem(item.productId, item.quantity);
          } catch (error) {
            console.error('Failed to sync cart item:', error);
          }
        }
        // Reload cart from API to get merged state
        loadCart();
      };
      // Only sync once after login
      const hasLocalCart = localStorage.getItem(CART_STORAGE_KEY);
      if (hasLocalCart) {
        localStorage.removeItem(CART_STORAGE_KEY);
        syncLocalToAPI();
      }
    }
  }, [isAuthenticated, isHydrated, user?.id]);

  // Save cart to localStorage (for guests)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated, isAuthenticated]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.addItem(product.id, quantity);
        // Reload cart to get updated state and filter out out-of-stock items
        const response = await cartApi.get();
        const items = response.items
          .map(apiToLocalItem)
          .filter(item => item.product && item.product.inStock !== false);
        setCartItems(items);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local cart for guests
      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId: product.id, product, quantity }];
      });
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (productId: string, delta: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.updateItem(productId, newQuantity);
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } catch (error) {
        console.error('Failed to update cart item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }, [isAuthenticated, cartItems]);

  const setQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.updateItem(productId, quantity);
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        );
      } catch (error) {
        console.error('Failed to update cart item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.removeItem(productId);
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      } catch (error) {
        console.error('Failed to remove cart item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.clear();
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const syncCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Calculate totals
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = getProductPrice(item.product);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        setQuantity,
        removeItem,
        clearCart,
        cartItemCount,
        subtotal,
        shipping,
        total,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
