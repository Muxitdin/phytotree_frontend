'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import type { Product } from '@/lib/api/types';
import {
  getProductName,
  getCategoryName,
  formatPrice,
  getProductImage,
  isGradient,
  getProductPrice,
  type Locale,
} from '@/lib/product-helpers';

interface LocalCartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: LocalCartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  subtotal?: number;
  shipping?: number;
  total?: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  subtotal = 0,
  shipping = 0,
  total = 0,
}: CartDrawerProps) {
  const { t, locale } = useI18n();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2A2A2A]/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF7F2] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]/10">
              <h2 className="font-serif text-2xl text-[#2A2A2A]">{t.cart.title}</h2>
              <button
                onClick={onClose}
                className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[#2A2A2A]/60 mb-4">
                    {t.cart.empty}
                  </p>
                  <button
                    onClick={onClose}
                    className="text-[#C4A265] hover:text-[#2A2A2A] underline underline-offset-4 transition-colors"
                  >
                    {t.cart.continueShopping}
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const productImage = getProductImage(item.product);
                  const isGradientImg = isGradient(productImage);
                  const productName = getProductName(item.product, locale as Locale);
                  const categoryName = getCategoryName(item.product.category, locale as Locale);
                  const price = getProductPrice(item.product);

                  return (
                    <motion.div
                      layout
                      key={item.productId}
                      className="flex gap-4 bg-white p-4 rounded-sm shadow-sm"
                    >
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={onClose}
                        className="w-20 h-24 flex-shrink-0 relative overflow-hidden"
                      >
                        {isGradientImg ? (
                          <div
                            className="w-full h-full"
                            style={{ background: productImage }}
                          />
                        ) : (
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={onClose}
                              className="font-serif text-[#2A2A2A] hover:text-[#C4A265] transition-colors"
                            >
                              {productName}
                            </Link>
                            <button
                              onClick={() => onRemoveItem(item.productId)}
                              className="text-[#2A2A2A]/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-[#2A2A2A]/60 uppercase tracking-wider mt-1">
                            {categoryName}
                          </p>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-[#2A2A2A]/20">
                            <button
                              onClick={() => onUpdateQuantity(item.productId, -1)}
                              className="p-1 hover:bg-[#2A2A2A]/5 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.productId, 1)}
                              className="p-1 hover:bg-[#2A2A2A]/5 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium text-[#2A2A2A]">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-[#2A2A2A]/10">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-[#2A2A2A]/60">
                    <span>{t.common.subtotal}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#2A2A2A]/60">
                    <span>{t.common.shipping}</span>
                    <span>
                      {shipping === 0 ? t.common.free : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-serif font-medium text-[#2A2A2A] pt-3 border-t border-[#2A2A2A]/10">
                    <span>{t.common.total}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-[#C4A265] text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#b08d55] transition-colors text-center"
                >
                  {t.cart.checkout}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
