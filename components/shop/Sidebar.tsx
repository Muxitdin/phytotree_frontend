'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/lib/api/types';
import { PriceRange } from '@/lib/types';
import { useI18n } from '@/contexts/I18nContext';
import { getCategoryName, type Locale } from '@/lib/product-helpers';

interface SidebarProps {
  categories?: Category[];
  categoriesLoading?: boolean;
  selectedCategorySlug: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
}

export function Sidebar({
  categories,
  categoriesLoading = false,
  selectedCategorySlug,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: SidebarProps) {
  const { t, locale } = useI18n();

  const handleMinPriceChange = (value: string) => {
    const min = value === '' ? null : Number(value);
    onPriceRangeChange({ ...priceRange, min });
  };

  const handleMaxPriceChange = (value: string) => {
    const max = value === '' ? null : Number(value);
    onPriceRangeChange({ ...priceRange, max });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 pr-8 mb-8 md:mb-0">
      <div className="sticky top-24">
        {/* Categories */}
        <div className="mb-10">
          <h3 className="font-serif text-xl text-[#2A2A2A] mb-6 pb-2 border-b border-[#2A2A2A]/10">
            {t.filters.categories}
          </h3>

          {categoriesLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#C4A265]" />
            </div>
          ) : (
            <ul className="space-y-4">
              {/* All categories option */}
              <li>
                <button
                  onClick={() => onCategoryChange(null)}
                  className="group flex items-center w-full text-left focus:outline-none"
                >
                  <div
                    className={`
                      w-4 h-4 rounded-full border border-[#2A2A2A] mr-3 flex items-center justify-center transition-all duration-300
                      ${selectedCategorySlug === null ? 'border-[#C4A265]' : 'group-hover:border-[#C4A265]'}
                    `}
                  >
                    {selectedCategorySlug === null && (
                      <motion.div
                        layoutId="category-indicator"
                        className="w-2 h-2 rounded-full bg-[#C4A265]"
                      />
                    )}
                  </div>
                  <span
                    className={`
                      text-sm tracking-wide transition-colors duration-300
                      ${selectedCategorySlug === null ? 'text-[#2A2A2A] font-medium' : 'text-[#2A2A2A]/60 group-hover:text-[#2A2A2A]'}
                    `}
                  >
                    {t.categories.all}
                  </span>
                </button>
              </li>

              {/* Category list */}
              {(categories || []).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => onCategoryChange(category.slug)}
                    className="group flex items-center w-full text-left focus:outline-none"
                  >
                    <div
                      className={`
                        w-4 h-4 rounded-full border border-[#2A2A2A] mr-3 flex items-center justify-center transition-all duration-300
                        ${selectedCategorySlug === category.slug ? 'border-[#C4A265]' : 'group-hover:border-[#C4A265]'}
                      `}
                    >
                      {selectedCategorySlug === category.slug && (
                        <motion.div
                          layoutId="category-indicator"
                          className="w-2 h-2 rounded-full bg-[#C4A265]"
                        />
                      )}
                    </div>
                    <span
                      className={`
                        text-sm tracking-wide transition-colors duration-300
                        ${selectedCategorySlug === category.slug ? 'text-[#2A2A2A] font-medium' : 'text-[#2A2A2A]/60 group-hover:text-[#2A2A2A]'}
                      `}
                    >
                      {getCategoryName(category, locale as Locale)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-10">
          <h3 className="font-serif text-xl text-[#2A2A2A] mb-6 pb-2 border-b border-[#2A2A2A]/10">
            {t.filters.priceRange}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A2A2A]/40 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder={t.filters.minPrice}
                min="0"
                value={priceRange.min ?? ''}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-full pl-6 pr-2 py-2 bg-transparent border border-[#2A2A2A]/20 focus:border-[#C4A265] focus:outline-none text-sm text-[#2A2A2A]"
              />
            </div>
            <span className="text-[#2A2A2A]/40">-</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A2A2A]/40 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder={t.filters.maxPrice}
                min="0"
                value={priceRange.max ?? ''}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full pl-6 pr-2 py-2 bg-transparent border border-[#2A2A2A]/20 focus:border-[#C4A265] focus:outline-none text-sm text-[#2A2A2A]"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
