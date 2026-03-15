'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer, HeroBanner } from '@/components/layout';
import { Sidebar, ProductGrid } from '@/components/shop';
import { CartDrawer } from '@/components/cart';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product } from '@/lib/api/types';
import { PriceRange } from '@/lib/types';

export default function Home() {
  // Products from context
  const {
    products,
    isLoading,
    hasMore,
    categories,
    categoriesLoading,
    filters,
    setFilters,
    loadMore,
  } = useProducts();

  // Cart
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    cartItemCount,
    subtotal,
    shipping,
    total,
    syncCart,
  } = useCart();

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Refresh cart data when cart drawer opens
  const handleOpenCart = () => {
    setIsCartOpen(true);
    syncCart(); // Refresh cart to get latest prices
  };

  // Local filter state for debouncing
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: null, max: null });
  const debouncedPriceRange = useDebounce(priceRange, 300);

  // Update context filters when local filters change
  useEffect(() => {
    setFilters({
      categorySlug: selectedCategorySlug || undefined,
      minPrice: debouncedPriceRange.min ?? undefined,
      maxPrice: debouncedPriceRange.max ?? undefined,
    });
  }, [selectedCategorySlug, debouncedPriceRange, setFilters]);

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategorySlug(categorySlug);
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product);
    handleOpenCart();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2A2A]">
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={handleOpenCart}
      />

      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row">
          <Sidebar
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategorySlug={selectedCategorySlug}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
          />

          <ProductGrid
            products={products}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
      />
    </div>
  );
}
