'use client';

import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/api/types';
import { ProductCard } from './ProductCard';
import { useI18n } from '@/contexts/I18nContext';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products = [],
  isLoading,
  hasMore,
  onLoadMore,
  onAddToCart,
}: ProductGridProps) {
  const { t } = useI18n();

  // Loading state (initial)
  if (isLoading && products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4A265]" />
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-[#2A2A2A]/60 text-lg">{t.admin.noProducts}</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            index={index}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mb-12">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3 border border-[#2A2A2A] text-[#2A2A2A] uppercase tracking-widest text-sm hover:bg-[#2A2A2A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.pagination.next
            )}
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-[#2A2A2A]/60">
        {products.length} {products.length === 1 ? t.common.product : t.common.products}
      </div>
    </div>
  );
}
