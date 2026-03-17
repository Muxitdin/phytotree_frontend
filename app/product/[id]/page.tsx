'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, Share2, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCart } from '@/contexts/CartContext';
import { useI18n } from '@/contexts/I18nContext';
import { Navbar, Footer } from '@/components/layout';
import { CartDrawer } from '@/components/cart';
import type { Product } from '@/lib/api/types';
import {
  getProductName,
  getProductDescription,
  getCategoryName,
  formatPrice,
  getProductImage,
  isGradient,
  type Locale,
} from '@/lib/product-helpers';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { getProductBySlug, products } = useProducts();
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
  const { t, locale } = useI18n();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setSelectedImageIndex(0); // Reset image index when loading new product
      const fetchedProduct = await getProductBySlug(id);
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    loadProduct();
  }, [id, getProductBySlug]);

  // Open cart drawer and sync cart data
  const handleOpenCart = () => {
    setIsCartOpen(true);
    syncCart();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <Navbar cartItemCount={cartItemCount} onCartClick={handleOpenCart} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#C4A265]" size={32} />
        </div>
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

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <Navbar cartItemCount={cartItemCount} onCartClick={handleOpenCart} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-[#2A2A2A] mb-4">{t.product.notFound}</h1>
            <Link
              href="/"
              className="text-[#C4A265] hover:underline"
            >
              {t.common.backToShop}
            </Link>
          </div>
        </div>
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

  const productName = getProductName(product, locale as Locale);
  const productDescription = getProductDescription(product, locale as Locale);
  const categoryName = getCategoryName(product.category, locale as Locale);
  const price = parseFloat(product.price);

  // Image slider logic
  const images = product.images && product.images.length > 0
    ? product.images
    : [getProductImage(product)];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedImageIndex] || images[0];
  const isGradientImage = isGradient(currentImage);

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // Get related products from same category
  const relatedProducts = products
    .filter((p) => p.category.id === product.category.id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar cartItemCount={cartItemCount} onCartClick={handleOpenCart} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-[#2A2A2A]/60 hover:text-[#C4A265]">
                {t.nav.shopAll}
              </Link>
            </li>
            <li className="text-[#2A2A2A]/40">/</li>
            <li>
              <span className="text-[#2A2A2A]/60">{categoryName}</span>
            </li>
            <li className="text-[#2A2A2A]/40">/</li>
            <li>
              <span className="text-[#2A2A2A]">{productName}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-sm overflow-hidden relative group">
              {isGradientImage ? (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: currentImage }}
                >
                  <span className="font-serif text-4xl text-white/30">
                    {categoryName.charAt(0)}
                  </span>
                </div>
              ) : (
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={currentImage}
                    alt={`${productName} - ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              )}

              {/* Navigation Arrows */}
              {hasMultipleImages && !isGradientImage && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#2A2A2A] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#2A2A2A] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && !isGradientImage && (
                <div className="absolute bottom-3 right-3 bg-[#2A2A2A]/70 text-white text-xs px-2 py-1 rounded">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Out of stock badge */}
              {!product.inStock && (
                <div className="absolute top-4 left-4 bg-[#2A2A2A]/80 text-white text-sm px-4 py-2">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && !isGradientImage && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-[#C4A265] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <span className="text-sm uppercase tracking-wider text-[#C4A265]">
                {categoryName}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] mb-4">
              {productName}
            </h1>

            <div className="mb-6">
              <span className="text-2xl text-[#2A2A2A]">
                {formatPrice(product.price)}
              </span>
            </div>

            {productDescription && (
              <p className="text-[#2A2A2A]/60 mb-8 leading-relaxed">
                {productDescription}
              </p>
            )}

            {!productDescription && (
              <p className="text-[#2A2A2A]/60 mb-8 leading-relaxed">
                {t.product.description.replace('{brand}', categoryName)}
              </p>
            )}

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#2A2A2A]/10 text-sm text-[#2A2A2A]/80 rounded-sm">
                {categoryName}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-3">
                {t.common.quantity}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#2A2A2A]/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-[#2A2A2A]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-[#2A2A2A]/60">
                  {t.common.total}: {formatPrice(price * quantity)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAddedToCart || !product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-widest transition-colors ${
                  isAddedToCart
                    ? 'bg-green-600 text-white'
                    : !product.inStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#C4A265]'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={18} />
                    {t.cart.added}
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    {t.cart.addToCart}
                  </>
                )}
              </button>

              <button className="p-4 border border-[#2A2A2A]/20 text-[#2A2A2A] hover:border-[#C4A265] hover:text-[#C4A265] transition-colors">
                <Heart size={18} />
              </button>

              <button className="p-4 border border-[#2A2A2A]/20 text-[#2A2A2A] hover:border-[#C4A265] hover:text-[#C4A265] transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-[#2A2A2A]/10 pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-[#2A2A2A]/60">
                  <Check size={16} className="text-[#C4A265]" />
                  {t.product.features.freeShipping}
                </div>
                <div className="flex items-center gap-2 text-[#2A2A2A]/60">
                  <Check size={16} className="text-[#C4A265]" />
                  {t.product.features.returns}
                </div>
                <div className="flex items-center gap-2 text-[#2A2A2A]/60">
                  <Check size={16} className="text-[#C4A265]" />
                  {t.product.features.quality}
                </div>
                <div className="flex items-center gap-2 text-[#2A2A2A]/60">
                  <Check size={16} className="text-[#C4A265]" />
                  {t.product.features.securePayment}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl text-[#2A2A2A] mb-8">
              {t.product.relatedProducts}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedImage = getProductImage(relatedProduct);
                const relatedIsGradient = isGradient(relatedImage);
                const relatedName = getProductName(relatedProduct, locale as Locale);
                const relatedCategory = getCategoryName(relatedProduct.category, locale as Locale);

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-sm mb-4 transition-transform group-hover:scale-[1.02] relative overflow-hidden">
                      {relatedIsGradient ? (
                        <div
                          className="w-full h-full"
                          style={{ background: relatedImage }}
                        />
                      ) : (
                        <Image
                          src={relatedImage}
                          alt={relatedName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#C4A265] mb-1">
                      {relatedCategory}
                    </div>
                    <h3 className="text-sm text-[#2A2A2A] group-hover:text-[#C4A265] transition-colors mb-1">
                      {relatedName}
                    </h3>
                    <div className="text-sm text-[#2A2A2A]">
                      {formatPrice(relatedProduct.price)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
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
