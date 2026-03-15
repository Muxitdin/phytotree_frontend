'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Loader2, ChevronRight, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useI18n } from '@/contexts/I18nContext';
import type { OrderStatus, Order } from '@/lib/api/types';
import { formatPrice, getProductImage, isGradient } from '@/lib/product-helpers';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { orders, isLoading: ordersLoading, hasMore, loadMore, getClickPaymentUrl } = useOrders();
  const { t, locale } = useI18n();

  const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: t.orders.status.pending,
    AWAITING_PAYMENT: 'Awaiting Payment',
    PAID: 'Paid',
    PROCESSING: t.orders.status.processing,
    SHIPPED: t.orders.status.shipped,
    DELIVERED: t.orders.status.delivered,
    CANCELLED: t.orders.status.cancelled,
    REFUNDED: 'Refunded',
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      ru: 'ru-RU',
      en: 'en-US',
      uz: 'uz-UZ',
    };
    return date.toLocaleDateString(localeMap[locale] || 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const handlePayOrder = async (orderId: string) => {
    try {
      const response = await getClickPaymentUrl(orderId);
      window.location.href = response.paymentUrl;
    } catch (err) {
      console.error('Failed to get payment URL:', err);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C4A265]" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl text-[#2A2A2A] mb-8">{t.orders.title}</h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package size={64} className="mx-auto text-[#2A2A2A]/20 mb-6" />
            <h2 className="font-serif text-xl text-[#2A2A2A] mb-4">
              {t.orders.empty}
            </h2>
            <p className="text-[#2A2A2A]/60 mb-8">
              {t.orders.emptyDescription}
            </p>
            <Link
              href="/"
              className="inline-block bg-[#2A2A2A] text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-[#C4A265] transition-colors"
            >
              {t.orders.goToShop}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#2A2A2A]/10 rounded-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-[#2A2A2A]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#2A2A2A]">
                        {t.orders.orderNumber} #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-sm text-xs font-medium ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-[#2A2A2A]/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-[#2A2A2A]">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="text-sm text-[#2A2A2A]/60">
                      {order.items.length} {order.items.length === 1 ? t.orders.item : t.orders.items}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.slice(0, 4).map((item, itemIndex) => {
                      const image = item.product?.images?.[0] || 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)';
                      const isGradientImg = isGradient(image);

                      return (
                        <div
                          key={itemIndex}
                          className="w-16 h-16 rounded-sm relative overflow-hidden"
                          title={item.productName}
                        >
                          {isGradientImg ? (
                            <div
                              className="w-full h-full"
                              style={{ background: image }}
                            />
                          ) : (
                            <Image
                              src={image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                      );
                    })}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 rounded-sm bg-[#FAF7F2] flex items-center justify-center text-sm text-[#2A2A2A]/60">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className="text-sm text-[#2A2A2A]/60">
                    <p className="font-medium text-[#2A2A2A]">{t.orders.shippingAddress}:</p>
                    <p>
                      {order.customerName}, {order.customerPhone}
                    </p>
                    {order.shippingAddress && (
                      <p>
                        {order.shippingAddress}
                        {order.shippingCity && `, ${order.shippingCity}`}
                      </p>
                    )}
                  </div>

                  {/* Pay Now Button for unpaid orders */}
                  {(order.status === 'PENDING' || order.status === 'AWAITING_PAYMENT') && (
                    <button
                      onClick={() => handlePayOrder(order.id)}
                      className="mt-4 bg-[#C4A265] text-white px-6 py-2 uppercase tracking-wider text-sm hover:bg-[#b08d55] transition-colors flex items-center gap-2"
                    >
                      <CreditCard size={16} />
                      Pay Now
                    </button>
                  )}
                </div>

                {/* Order Details Accordion */}
                <details className="border-t border-[#2A2A2A]/10">
                  <summary className="px-6 py-4 cursor-pointer text-sm text-[#C4A265] hover:text-[#b08d55] transition-colors flex items-center justify-between">
                    <span>{t.orders.orderDetails}</span>
                    <ChevronRight size={16} className="transition-transform [details[open]_&]:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2A2A2A]/10">
                          <th className="text-left py-2 text-[#2A2A2A]/60 font-normal">{t.common.product}</th>
                          <th className="text-center py-2 text-[#2A2A2A]/60 font-normal">{t.common.quantity}</th>
                          <th className="text-right py-2 text-[#2A2A2A]/60 font-normal">{t.common.price}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, itemIndex) => {
                          const image = item.product?.images?.[0] || 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)';
                          const isGradientImg = isGradient(image);

                          return (
                            <tr key={itemIndex} className="border-b border-[#2A2A2A]/5">
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-sm flex-shrink-0 relative overflow-hidden">
                                    {isGradientImg ? (
                                      <div
                                        className="w-full h-full"
                                        style={{ background: image }}
                                      />
                                    ) : (
                                      <Image
                                        src={image}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-[#2A2A2A]">{item.productName}</p>
                                    <p className="text-xs text-[#2A2A2A]/60">
                                      {formatPrice(item.productPrice)} each
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center text-[#2A2A2A]">
                                {item.quantity}
                              </td>
                              <td className="py-3 text-right text-[#2A2A2A]">
                                {formatPrice(item.totalPrice)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-[#2A2A2A]/10">
                          <td colSpan={2} className="py-2 text-[#2A2A2A]/60">{t.common.subtotal}</td>
                          <td className="py-2 text-right">{formatPrice(order.subtotal)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="py-2 text-[#2A2A2A]/60">{t.common.shipping}</td>
                          <td className="py-2 text-right">
                            {parseFloat(order.shippingCost) === 0 ? t.common.free : formatPrice(order.shippingCost)}
                          </td>
                        </tr>
                        <tr className="font-medium">
                          <td colSpan={2} className="py-2 text-[#2A2A2A]">{t.common.total}</td>
                          <td className="py-2 text-right text-[#2A2A2A]">{formatPrice(order.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Payment info */}
                    {order.payments && order.payments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#2A2A2A]/10">
                        <h4 className="text-sm font-medium text-[#2A2A2A] mb-2">Payment History</h4>
                        {order.payments.map((payment, idx) => (
                          <div key={idx} className="text-sm text-[#2A2A2A]/60 flex justify-between">
                            <span>{payment.provider} - {payment.status}</span>
                            <span>{formatPrice(payment.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              </motion.div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={ordersLoading}
                  className="px-8 py-3 border border-[#2A2A2A] text-[#2A2A2A] uppercase tracking-widest text-sm hover:bg-[#2A2A2A] hover:text-white transition-colors disabled:opacity-50"
                >
                  {ordersLoading ? (
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                  ) : null}
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
