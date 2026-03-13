'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useI18n } from '@/contexts/I18nContext';
import { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

const DEFAULT_IMAGE_COLOR = 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { t } = useI18n();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    price: 0,
    category: 'Skincare',
    imageColor: DEFAULT_IMAGE_COLOR,
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C4A265]" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData,
      });
    } else {
      addProduct(formData);
    }

    closeModal();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      brand: '',
      name: '',
      price: 0,
      category: 'Skincare',
      imageColor: DEFAULT_IMAGE_COLOR,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      brand: product.brand,
      name: product.name,
      price: product.price,
      category: product.category,
      imageColor: product.imageColor,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#2A2A2A]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#2A2A2A] hover:text-[#C4A265] transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm uppercase tracking-wider hidden sm:inline">
                  {t.common.backToShop}
                </span>
              </Link>
              <div className="h-6 w-px bg-[#2A2A2A]/10" />
              <h1 className="font-serif text-xl text-[#2A2A2A]">
                {t.admin.title}
              </h1>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-[#2A2A2A] text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#C4A265] transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">{t.admin.addProduct}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border border-[#2A2A2A]/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FAF7F2] rounded-sm">
                <Package size={24} className="text-[#C4A265]" />
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2A2A2A]">{products.length}</p>
                <p className="text-sm text-[#2A2A2A]/60 uppercase tracking-wider">{t.admin.totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border border-[#2A2A2A]/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FAF7F2] rounded-sm">
                <Package size={24} className="text-[#C4A265]" />
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2A2A2A]">
                  {CATEGORIES.filter(c => c !== 'All').length}
                </p>
                <p className="text-sm text-[#2A2A2A]/60 uppercase tracking-wider">{t.admin.totalCategories}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border border-[#2A2A2A]/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FAF7F2] rounded-sm">
                <Package size={24} className="text-[#C4A265]" />
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2A2A2A]">
                  ${products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </p>
                <p className="text-sm text-[#2A2A2A]/60 uppercase tracking-wider">{t.admin.totalValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#2A2A2A]/10 rounded-sm overflow-hidden">
          <div className="p-6 border-b border-[#2A2A2A]/10">
            <h2 className="font-serif text-xl text-[#2A2A2A]">{t.admin.productManagement}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2A2A2A]/10 bg-[#FAF7F2]/50">
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium">
                    {t.common.product}
                  </th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium">
                    {t.common.category}
                  </th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium">
                    {t.common.price}
                  </th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium text-right">
                    {t.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[#2A2A2A]/5 hover:bg-[#FAF7F2]/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-sm flex-shrink-0"
                          style={{ background: product.imageColor }}
                        />
                        <div>
                          <div className="font-medium text-[#2A2A2A]">{product.name}</div>
                          <div className="text-sm text-[#2A2A2A]/60">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-1 bg-[#FAF7F2] text-sm text-[#2A2A2A]/80 rounded-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#2A2A2A] font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-[#2A2A2A]/60 hover:text-[#C4A265] transition-colors"
                          title={t.common.edit}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 text-[#2A2A2A]/60 hover:text-red-500 transition-colors"
                          title={t.common.delete}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-[#2A2A2A]/20 mb-4" />
              <p className="text-[#2A2A2A]/60">{t.admin.noProducts}</p>
              <button
                onClick={openAddModal}
                className="mt-4 text-[#C4A265] hover:underline"
              >
                {t.admin.addFirstProduct}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white p-8 w-full max-w-md shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2A2A2A]">
                  {editingProduct ? t.admin.editProduct : t.admin.newProduct}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    {t.product.brand}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder={t.product.brand}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    {t.product.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder={t.product.name}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      {t.common.price} ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      {t.common.category}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none bg-white transition-colors"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    {t.product.imageColor}
                  </label>
                  <input
                    type="text"
                    value={formData.imageColor}
                    onChange={(e) => setFormData({ ...formData, imageColor: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors text-sm"
                    placeholder="linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)"
                  />
                  <div
                    className="mt-2 h-12 rounded-sm border border-[#2A2A2A]/10"
                    style={{ background: formData.imageColor }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2A2A2A] text-white py-3 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors mt-6"
                >
                  {editingProduct ? t.admin.saveChanges : t.admin.createProduct}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 w-full max-w-sm shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-lg text-[#2A2A2A] mb-4">
                {t.common.confirmDelete}
              </h3>
              <p className="text-[#2A2A2A]/60 mb-6">
                {t.common.deleteWarning}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 border border-[#2A2A2A]/20 text-[#2A2A2A] hover:bg-[#FAF7F2] transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {t.common.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
