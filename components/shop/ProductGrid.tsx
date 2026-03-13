'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ITEMS_PER_PAGE } from '@/lib/constants';

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  currentPage,
  onPageChange,
  onAddToCart,
}: ProductGridProps) {
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-[#2A2A2A]/60 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
        {currentProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            index={index}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mb-12">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-[#2A2A2A] disabled:opacity-30 hover:text-[#C4A265] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex space-x-2">
            {renderPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[#2A2A2A]/40">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                    ${currentPage === page ? 'bg-[#C4A265] text-white' : 'text-[#2A2A2A] hover:bg-[#2A2A2A]/5'}
                  `}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-[#2A2A2A] disabled:opacity-30 hover:text-[#C4A265] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-[#2A2A2A]/60">
        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} of {products.length} products
      </div>
    </div>
  );
}
