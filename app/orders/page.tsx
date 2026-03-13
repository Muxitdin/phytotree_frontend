'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useI18n } from '@/contexts/I18nContext';
import { OrderStatus } from '@/lib/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userOrders } = useOrders();
  const { t, locale } = useI18n();

  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: t.orders.status.pending,
    processing: t.orders.status.processing,
    shipped: t.orders.status.shipped,
    delivered: t.orders.status.delivered,
    cancelled: t.orders.status.cancelled,
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
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

        {userOrders.length === 0 ? (
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
            {userOrders.map((order, index) => (
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
                        {t.orders.orderNumber} #{order.id.replace('order-', '')}
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
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-[#2A2A2A]/60">
                      {order.items.length} {order.items.length === 1 ? t.orders.item : t.orders.items}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.slice(0, 4).map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="w-16 h-16 rounded-sm"
                        style={{ background: item.imageColor }}
                        title={`${item.productBrand} - ${item.productName}`}
                      />
                    ))}
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
                      {order.shippingAddress.fullName}, {order.shippingAddress.phone}
                    </p>
                    <p>
                      {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
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
                        {order.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b border-[#2A2A2A]/5">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-sm flex-shrink-0"
                                  style={{ background: item.imageColor }}
                                />
                                <div>
                                  <p className="text-[#2A2A2A]">{item.productName}</p>
                                  <p className="text-xs text-[#2A2A2A]/60">{item.productBrand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-center text-[#2A2A2A]">
                              {item.quantity}
                            </td>
                            <td className="py-3 text-right text-[#2A2A2A]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-[#2A2A2A]/10">
                          <td colSpan={2} className="py-2 text-[#2A2A2A]/60">{t.common.subtotal}</td>
                          <td className="py-2 text-right">${order.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="py-2 text-[#2A2A2A]/60">{t.common.shipping}</td>
                          <td className="py-2 text-right">
                            {order.shipping === 0 ? t.common.free : `$${order.shipping.toFixed(2)}`}
                          </td>
                        </tr>
                        <tr className="font-medium">
                          <td colSpan={2} className="py-2 text-[#2A2A2A]">{t.common.total}</td>
                          <td className="py-2 text-right text-[#2A2A2A]">${order.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
