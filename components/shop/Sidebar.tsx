'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';
import { PriceRange } from '@/lib/types';
import { useI18n } from '@/contexts/I18nContext';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
}

// Mapping from English category names to translation keys
const CATEGORY_KEYS: Record<string, keyof typeof import('@/lib/i18n/dictionaries/ru').ru.categories> = {
  'All': 'all',
  'Skincare': 'skincare',
  'Makeup': 'makeup',
  'Fragrance': 'fragrance',
  'Hair Care': 'hairCare',
  'Body Care': 'bodyCare',
  'Tools & Accessories': 'toolsAccessories',
};

export function Sidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: SidebarProps) {
  const { t } = useI18n();

  const handleMinPriceChange = (value: string) => {
    const min = value === '' ? null : Number(value);
    onPriceRangeChange({ ...priceRange, min });
  };

  const handleMaxPriceChange = (value: string) => {
    const max = value === '' ? null : Number(value);
    onPriceRangeChange({ ...priceRange, max });
  };

  const getCategoryLabel = (category: string): string => {
    const key = CATEGORY_KEYS[category];
    if (key && t.categories[key]) {
      return t.categories[key];
    }
    return category;
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 pr-8 mb-8 md:mb-0">
      <div className="sticky top-24">
        {/* Categories */}
        <div className="mb-10">
          <h3 className="font-serif text-xl text-[#2A2A2A] mb-6 pb-2 border-b border-[#2A2A2A]/10">
            {t.filters.categories}
          </h3>
          <ul className="space-y-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategoryChange(category)}
                  className="group flex items-center w-full text-left focus:outline-none"
                >
                  <div
                    className={`
                      w-4 h-4 rounded-full border border-[#2A2A2A] mr-3 flex items-center justify-center transition-all duration-300
                      ${selectedCategory === category ? 'border-[#C4A265]' : 'group-hover:border-[#C4A265]'}
                    `}
                  >
                    {selectedCategory === category && (
                      <motion.div
                        layoutId="category-indicator"
                        className="w-2 h-2 rounded-full bg-[#C4A265]"
                      />
                    )}
                  </div>
                  <span
                    className={`
                      text-sm tracking-wide transition-colors duration-300
                      ${selectedCategory === category ? 'text-[#2A2A2A] font-medium' : 'text-[#2A2A2A]/60 group-hover:text-[#2A2A2A]'}
                    `}
                  >
                    {getCategoryLabel(category)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
