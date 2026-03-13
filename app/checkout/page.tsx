'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useI18n } from '@/contexts/I18nContext';
import { ShippingAddress } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { t } = useI18n();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Pre-fill name from user
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, fullName: user.name }));
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

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <ShoppingBag size={64} className="text-[#2A2A2A]/20 mb-6" />
        <h1 className="font-serif text-2xl text-[#2A2A2A] mb-4">{t.cart.empty}</h1>
        <p className="text-[#2A2A2A]/60 mb-8">{t.cart.freeShippingNote.replace('${amount}', '0')}</p>
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
    const newErrors: Partial<ShippingAddress> = {};

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
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t.checkout.validation.enterPostalCode;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = createOrder(cartItems, formData, subtotal, shipping, total);
    setOrderId(order.id);
    clearCart();
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (isSuccess) {
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
          <p className="text-[#2A2A2A]/60 mb-2">
            {t.checkout.orderNumber}: <span className="font-medium text-[#2A2A2A]">{orderId}</span>
          </p>
          <p className="text-[#2A2A2A]/60 mb-8">
            {t.checkout.confirmationSent}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    errors.fullName
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                  placeholder="Иван Иванов"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
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
                    errors.phone
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
                    errors.address
                      ? 'border-red-500'
                      : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                  }`}
                  placeholder="ул. Примерная, д. 1, кв. 1"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    {t.checkout.city}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full p-3 border bg-white outline-none transition-colors ${
                      errors.city
                        ? 'border-red-500'
                        : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                    }`}
                    placeholder="Москва"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    {t.checkout.postalCode}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full p-3 border bg-white outline-none transition-colors ${
                      errors.postalCode
                        ? 'border-red-500'
                        : 'border-[#2A2A2A]/20 focus:border-[#C4A265]'
                    }`}
                    placeholder="123456"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2A2A2A] text-white py-4 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t.checkout.processing}
                  </>
                ) : (
                  t.checkout.placeOrder
                )}
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div
                      className="w-16 h-16 rounded-sm flex-shrink-0"
                      style={{ background: item.imageColor }}
                    />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-[#C4A265]">
                        {item.brand}
                      </p>
                      <p className="text-sm text-[#2A2A2A] mb-1">{item.name}</p>
                      <p className="text-sm text-[#2A2A2A]/60">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-[#2A2A2A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#2A2A2A]/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2A2A2A]/60">{t.common.subtotal}</span>
                  <span className="text-[#2A2A2A]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2A2A2A]/60">{t.common.shipping}</span>
                  <span className="text-[#2A2A2A]">
                    {shipping === 0 ? t.common.free : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#2A2A2A]/10 pt-3 flex justify-between">
                  <span className="font-medium text-[#2A2A2A]">{t.common.total}</span>
                  <span className="font-serif text-xl text-[#2A2A2A]">
                    ${total.toFixed(2)}
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
