'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, Share2, Check } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCart } from '@/contexts/CartContext';
import { useI18n } from '@/contexts/I18nContext';
import { Navbar, Footer } from '@/components/layout';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { getProductById, products } = useProducts();
  const { addToCart, cartItemCount } = useCart();
  const { t } = useI18n();

  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
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
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // Get related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

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
              <span className="text-[#2A2A2A]/60">{product.category}</span>
            </li>
            <li className="text-[#2A2A2A]/40">/</li>
            <li>
              <span className="text-[#2A2A2A]">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-sm overflow-hidden"
            style={{ background: product.imageColor }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-4xl text-white/30">
                {product.brand.charAt(0)}
              </span>
            </div>
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
                {product.brand}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <span className="text-2xl text-[#2A2A2A]">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="text-[#2A2A2A]/60 mb-8 leading-relaxed">
              {t.product.description.replace('{brand}', product.brand)}
            </p>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#2A2A2A]/10 text-sm text-[#2A2A2A]/80 rounded-sm">
                {product.category}
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
                  {t.common.total}: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAddedToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-widest transition-colors ${
                  isAddedToCart
                    ? 'bg-green-600 text-white'
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
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div
                    className="aspect-square rounded-sm mb-4 transition-transform group-hover:scale-[1.02]"
                    style={{ background: relatedProduct.imageColor }}
                  />
                  <div className="text-xs uppercase tracking-wider text-[#C4A265] mb-1">
                    {relatedProduct.brand}
                  </div>
                  <h3 className="text-sm text-[#2A2A2A] group-hover:text-[#C4A265] transition-colors mb-1">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-sm text-[#2A2A2A]">
                    ${relatedProduct.price.toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
