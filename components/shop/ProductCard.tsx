'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/api/types';
import { useI18n } from '@/contexts/I18nContext';
import {
  getProductName,
  getCategoryName,
  formatPrice,
  getProductImage,
  isGradient,
  type Locale,
} from '@/lib/product-helpers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t, locale } = useI18n();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const productName = getProductName(product, locale as Locale);
  const categoryName = getCategoryName(product.category, locale as Locale);
  const productImage = getProductImage(product);
  const isGradientImage = isGradient(productImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5] mb-4">
          {isGradientImage ? (
            <div
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ background: productImage }}
            />
          ) : (
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Out of stock badge */}
          {!product.inStock && (
            <div className="absolute top-4 left-4 bg-[#2A2A2A]/80 text-white text-xs px-3 py-1">
              Out of Stock
            </div>
          )}

          {/* Add to Cart Overlay Button */}
          <AnimatePresence>
            {isHovered && product.inStock && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={handleAddToCart}
                className="absolute bottom-4 left-4 right-4 bg-[#C4A265] text-white py-3 uppercase tracking-widest text-xs font-medium hover:bg-[#b08d55] transition-colors shadow-lg"
              >
                {t.cart.addToCart}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#2A2A2A]/60 mb-1">
            {categoryName}
          </h3>
          <h2 className="font-serif text-lg text-[#2A2A2A] mb-2 group-hover:text-[#C4A265] transition-colors duration-300">
            {productName}
          </h2>
          <span className="text-sm font-medium text-[#2A2A2A]">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
