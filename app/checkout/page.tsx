'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useI18n } from '@/contexts/I18nContext';
import type { CreateOrderDto } from '@/lib/api/types';
import {
  getProductName,
  getCategoryName,
  formatPrice,
  getProductImage,
  isGradient,
  getProductPrice,
  type Locale,
} from '@/lib/product-helpers';

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note: string;
}

type CheckoutState = 'form' | 'creating' | 'redirecting' | 'success' | 'error';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { cartItems, subtotal, shipping, total, clearCart, syncCart } = useCart();
  const { createOrder, getClickPaymentUrl } = useOrders();
  const { t, locale } = useI18n();

  const [state, setState] = useState<CheckoutState>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  // Sync cart to get latest prices when checkout page loads
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Pre-fill name from user
  useEffect(() => {
    if (user) {
      const userName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      if (userName) {
        setFormData((prev) => ({ ...prev, fullName: userName }));
      }
      if (user.phoneNumber) {
        setFormData((prev) => ({ ...prev, phone: user.phoneNumber || '' }));
      }
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C4A265]" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0 && state !== 'success') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <ShoppingBag size={64} className="text-[#2A2A2A]/20 mb-6" />
        <h1 className="font-serif text-2xl text-[#2A2A2A] mb-4">{t.cart.empty}</h1>
        <Link
          href="/"
          className="bg-[#2A2A2A] text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-[#C4A265] transition-colors"
        >
          {t.orders.goToShop}
        </Link>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.checkout.validation.enterName;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.checkout.validation.enterPhone;
    }
    if (!formData.address.trim()) {
      newErrors.address = t.checkout.validation.enterAddress;
    }
    if (!formData.city.trim()) {
      newErrors.city = t.checkout.validation.enterCity;
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setState('creating');
      setError(null);

      // Create order
      const orderData: CreateOrderDto = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingNote: formData.note || undefined,
      };

      const order = await createOrder(orderData);
      setOrderId(order.id);
      setOrderNumber(order.orderNumber);

      // Get Click payment URL
      setState('redirecting');
      const paymentResponse = await getClickPaymentUrl(order.id);

      // Clear cart before redirect
      await clearCart();

      // Redirect to Click payment page
      window.location.href = paymentResponse.paymentUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process order');
      setState('error');
    }
  };

  // Success state (user returned from payment)
  if (state === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8"
        >
          <Check size={40} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="font-serif text-3xl text-[#2A2A2A] mb-4">
            {t.checkout.orderSuccess}
          </h1>
          {orderNumber && (
            <p className="text-[#2A2A2A]/60 mb-2">
              {t.checkout.orderNumber}: <span className="font-medium text-[#2A2A2A]">{orderNumber}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/orders"
              className="bg-[#2A2A2A] text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-[#C4A265] transition-colors"
            >
              {t.orders.title}
            </Link>
            <Link
              href="/"
              className="border border-[#2A2A2A]/20 text-[#2A2A2A] px-8 py-3 uppercase tracking-wider text-sm hover:border-[#C4A265] hover:text-[#C4A265] transition-colors"
            >
              {t.cart.continueShopping}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-8"
        >
          <AlertCircle size={40} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="font-serif text-3xl text-[#2A2A2A] mb-4">
            {t.auth.loginError}
          </h1>
          <p className="text-[#2A2A2A]/60 mb-8">{error}</p>

          <button
            onClick={() => setState('form')}
            className="bg-[#2A2A2A] text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-[#C4A265] transition-colors"
          >
            {t.auth.tryAgain}
          </button>
        </motion.div>
      </div>
    );
  }

  // Processing states
  if (state === 'creating' || state === 'redirecting') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-[#C4A265] mb-6" size={48} />
        <h1 className="font-serif text-2xl text-[#2A2A2A] mb-2">
          {state === 'creating' ? t.checkout.processing : 'Redirecting to payment...'}
        </h1>
        <p className="text-[#2A2A2A]/60">
          Please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#2A2A2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#2A2A2A] hover:text-[#C4A265] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm uppercase tracking-wider">{t.common.backToShop}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl text-[#2A2A2A] text-center mb-12">
          {t.checkout.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-xl text-[#2A2A2A] mb-6">
              {t.checkout.shippingDetails}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full p-3 border bg-white outline-none transition-colors ${
                    formErrors.fullName
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 border bg-white outline-none transition-colors ${
                    formErrors.phone
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                  placeholder="+998 90 123 45 67"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                  {t.checkout.city}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full p-3 border bg-white outline-none transition-colors ${
                    formErrors.city
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                  {t.checkout.address}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full p-3 border bg-white outline-none transition-colors ${
                    formErrors.address
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-[#2A2A2A]/20 bg-white outline-none focus:border-[#C4A265] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2A2A2A] text-white py-4 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Pay with Click
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-serif text-xl text-[#2A2A2A] mb-6">
              {t.checkout.yourOrder}
            </h2>

            <div className="bg-white border border-[#2A2A2A]/10 rounded-sm p-6">
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const productImage = getProductImage(item.product);
                  const isGradientImg = isGradient(productImage);
                  const productName = getProductName(item.product, locale as Locale);
                  const categoryName = getCategoryName(item.product.category, locale as Locale);
                  const price = getProductPrice(item.product);

                  return (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-16 h-16 rounded-sm flex-shrink-0 relative overflow-hidden">
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
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-wider text-[#C4A265]">
                          {categoryName}
                        </p>
                        <p className="text-sm text-[#2A2A2A] mb-1">{productName}</p>
                        <p className="text-sm text-[#2A2A2A]/60">
                          {item.quantity} x {formatPrice(price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-[#2A2A2A]">
                        {formatPrice(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-[#2A2A2A]/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2A2A2A]/60">{t.common.subtotal}</span>
                  <span className="text-[#2A2A2A]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2A2A2A]/60">{t.common.shipping}</span>
                  <span className="text-[#2A2A2A]">
                    {shipping === 0 ? t.common.free : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-[#2A2A2A]/10 pt-3 flex justify-between">
                  <span className="font-medium text-[#2A2A2A]">{t.common.total}</span>
                  <span className="font-serif text-xl text-[#2A2A2A]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Note */}
              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-[#FAF7F2] text-sm text-[#2A2A2A]/60">
                  {t.cart.freeShippingNote.replace('${amount}', (100 - subtotal).toFixed(2))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
