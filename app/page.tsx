'use client';

import { useMemo, useState } from 'react';
import { Navbar, Footer, HeroBanner } from '@/components/layout';
import { Sidebar, ProductGrid } from '@/components/shop';
import { CartDrawer } from '@/components/cart';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Product, PriceRange } from '@/lib/types';

export default function Home() {
  // Products from context
  const { products } = useProducts();

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
  } = useCart();

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: null, max: null });
  const debouncedPriceRange = useDebounce(priceRange, 300);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by price range
    if (debouncedPriceRange.min !== null) {
      result = result.filter((p) => p.price >= debouncedPriceRange.min!);
    }
    if (debouncedPriceRange.max !== null) {
      result = result.filter((p) => p.price <= debouncedPriceRange.max!);
    }

    return result;
  }, [products, selectedCategory, debouncedPriceRange]);

  // Reset page when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2A2A]">
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
          />

          <ProductGrid
            products={filteredProducts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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
