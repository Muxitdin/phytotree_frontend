'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Loader2,
  Upload,
  FolderPlus,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useI18n } from '@/contexts/I18nContext';
import type { Product, Category } from '@/lib/api/types';
import { api } from '@/lib/api/client';
import {
  getProductName,
  getCategoryName,
  formatPrice,
  getProductImage,
  isGradient,
  type Locale,
} from '@/lib/product-helpers';

interface ProductFormData {
  slug: string;
  nameRu: string;
  nameEn: string;
  nameUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionUz: string;
  price: string;
  categoryId: string;
  images: string[];
  inStock: boolean;
}

interface CategoryFormData {
  slug: string;
  nameRu: string;
  nameEn: string;
  nameUz: string;
  imageUrl: string;
}

const DEFAULT_PRODUCT_FORM: ProductFormData = {
  slug: '',
  nameRu: '',
  nameEn: '',
  nameUz: '',
  descriptionRu: '',
  descriptionEn: '',
  descriptionUz: '',
  price: '0',
  categoryId: '',
  images: [],
  inStock: true,
};

const DEFAULT_CATEGORY_FORM: CategoryFormData = {
  slug: '',
  nameRu: '',
  nameEn: '',
  nameUz: '',
  imageUrl: '',
};

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
  } = useProducts();
  const { t, locale } = useI18n();

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>(DEFAULT_PRODUCT_FORM);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(DEFAULT_CATEGORY_FORM);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ========== PRODUCT HANDLERS ==========

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        slug: productFormData.slug || generateSlug(productFormData.nameEn),
        nameRu: productFormData.nameRu,
        nameEn: productFormData.nameEn,
        nameUz: productFormData.nameUz,
        descriptionRu: productFormData.descriptionRu || undefined,
        descriptionEn: productFormData.descriptionEn || undefined,
        descriptionUz: productFormData.descriptionUz || undefined,
        price: parseFloat(productFormData.price),
        categoryId: productFormData.categoryId,
        images: productFormData.images,
        inStock: productFormData.inStock,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      closeProductModal();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      ...DEFAULT_PRODUCT_FORM,
      categoryId: categories?.[0]?.id || '',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      slug: product.slug,
      nameRu: product.nameRu,
      nameEn: product.nameEn,
      nameUz: product.nameUz,
      descriptionRu: product.descriptionRu || '',
      descriptionEn: product.descriptionEn || '',
      descriptionUz: product.descriptionUz || '',
      price: product.price,
      categoryId: product.categoryId,
      images: product.images || [],
      inStock: product.inStock,
    });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // ========== IMAGE UPLOAD HANDLERS ==========

  interface CloudinarySignature {
    apiKey: string;
    timestamp: string;
    signature: string;
    folder: string;
    cloudName: string;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1️⃣ get signature from backend (using authenticated API client)
      const signatureData = await api.get<CloudinarySignature>('/upload/signature?folder=products');

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);

      // 2️⃣ upload directly to Cloudinary
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await cloudinaryRes.json();

      setProductFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.secure_url],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please make sure you are logged in as admin.");
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ========== CATEGORY HANDLERS ==========

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoryData = {
        slug: categoryFormData.slug || generateSlug(categoryFormData.nameEn),
        nameRu: categoryFormData.nameRu,
        nameEn: categoryFormData.nameEn,
        nameUz: categoryFormData.nameUz,
        imageUrl: categoryFormData.imageUrl || undefined,
      };

      await createCategory(categoryData);
      closeCategoryModal();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCategoryModal = () => {
    setCategoryFormData(DEFAULT_CATEGORY_FORM);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // Calculate total value
  const totalValue = products?.reduce((sum, p) => sum + parseFloat(p.price), 0) || 0;

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
            <div className="flex items-center gap-2">
              <button
                onClick={openCategoryModal}
                className="flex items-center gap-2 bg-[#FAF7F2] border border-[#2A2A2A]/20 text-[#2A2A2A] px-4 py-2 text-sm uppercase tracking-wider hover:border-[#C4A265] hover:text-[#C4A265] transition-colors"
              >
                <FolderPlus size={16} />
                <span className="hidden sm:inline">Add Category</span>
              </button>
              <button
                onClick={openAddProductModal}
                className="flex items-center gap-2 bg-[#2A2A2A] text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#C4A265] transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t.admin.addProduct}</span>
              </button>
            </div>
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
                <p className="text-2xl font-serif text-[#2A2A2A]">{products?.length || 0}</p>
                <p className="text-sm text-[#2A2A2A]/60 uppercase tracking-wider">{t.admin.totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border border-[#2A2A2A]/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FAF7F2] rounded-sm">
                <Tag size={24} className="text-[#C4A265]" />
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2A2A2A]">
                  {categories?.length || 0}
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
                  {formatPrice(totalValue)}
                </p>
                <p className="text-sm text-[#2A2A2A]/60 uppercase tracking-wider">{t.admin.totalValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <div className="bg-white border border-[#2A2A2A]/10 rounded-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-[#2A2A2A]/10 flex justify-between items-center">
              <h2 className="font-serif text-xl text-[#2A2A2A]">Categories</h2>
              <button
                onClick={openCategoryModal}
                className="text-[#C4A265] hover:underline text-sm"
              >
                + Add Category
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] text-sm text-[#2A2A2A] rounded-sm"
                  >
                    <Tag size={14} className="text-[#C4A265]" />
                    {getCategoryName(category, locale as Locale)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[#2A2A2A]/60 font-medium text-right">
                    {t.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  const productImage = getProductImage(product);
                  const isGradientImg = isGradient(productImage);
                  const productName = getProductName(product, locale as Locale);
                  const categoryName = getCategoryName(product.category, locale as Locale);

                  return (
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
                          <div className="w-12 h-12 rounded-sm flex-shrink-0 relative overflow-hidden">
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
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#2A2A2A]">{productName}</div>
                            <div className="text-sm text-[#2A2A2A]/60">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2 py-1 bg-[#FAF7F2] text-sm text-[#2A2A2A]/80 rounded-sm">
                          {categoryName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#2A2A2A] font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2 py-1 text-xs rounded-sm ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditProductModal(product)}
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {(!products || products.length === 0) && (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-[#2A2A2A]/20 mb-4" />
              <p className="text-[#2A2A2A]/60">{t.admin.noProducts}</p>
              <button
                onClick={openAddProductModal}
                className="mt-4 text-[#C4A265] hover:underline"
              >
                {t.admin.addFirstProduct}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeProductModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white p-8 w-full max-w-2xl shadow-2xl rounded-sm my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2A2A2A]">
                  {editingProduct ? t.admin.editProduct : t.admin.newProduct}
                </h3>
                <button
                  onClick={closeProductModal}
                  className="text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                {/* Slug */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={productFormData.slug}
                    onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="product-name (auto-generated if empty)"
                  />
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Name (RU)
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.nameRu}
                      onChange={(e) => setProductFormData({ ...productFormData, nameRu: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                      placeholder="Название"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Name (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.nameEn}
                      onChange={(e) => setProductFormData({ ...productFormData, nameEn: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Name (UZ)
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.nameUz}
                      onChange={(e) => setProductFormData({ ...productFormData, nameUz: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                      placeholder="Nomi"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Description (RU)
                    </label>
                    <textarea
                      value={productFormData.descriptionRu}
                      onChange={(e) => setProductFormData({ ...productFormData, descriptionRu: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors resize-none"
                      placeholder="Описание"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Description (EN)
                    </label>
                    <textarea
                      value={productFormData.descriptionEn}
                      onChange={(e) => setProductFormData({ ...productFormData, descriptionEn: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors resize-none"
                      placeholder="Description"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      Description (UZ)
                    </label>
                    <textarea
                      value={productFormData.descriptionUz}
                      onChange={(e) => setProductFormData({ ...productFormData, descriptionUz: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors resize-none"
                      placeholder="Tavsif"
                    />
                  </div>
                </div>

                {/* Price and Category */}
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
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                      {t.common.category}
                    </label>
                    <select
                      value={productFormData.categoryId}
                      onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                      className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none bg-white transition-colors"
                      required
                    >
                      <option value="">Select category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {getCategoryName(category, locale as Locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={productFormData.inStock}
                    onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-[#C4A265]"
                  />
                  <label htmlFor="inStock" className="text-sm text-[#2A2A2A]">
                    In Stock
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Images
                  </label>

                  {/* Upload Button */}
                  <div className="flex gap-2 mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#2A2A2A]/20 text-[#2A2A2A] hover:bg-[#C4A265] hover:text-white hover:border-[#C4A265] transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Image
                        </>
                      )}
                    </button>
                  </div>

                  {/* Image Preview */}
                  {productFormData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {productFormData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="w-20 h-20 rounded-sm overflow-hidden relative">
                            <Image
                              src={img}
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {productFormData.images.length === 0 && (
                    <p className="text-sm text-[#2A2A2A]/40">
                      No images uploaded. Click "Upload Image" to add product images.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !productFormData.categoryId}
                  className="w-full bg-[#2A2A2A] text-white py-3 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingProduct ? t.admin.saveChanges : t.admin.createProduct}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Create Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeCategoryModal}
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
                  New Category
                </h3>
                <button
                  onClick={closeCategoryModal}
                  className="text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                {/* Slug */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="category-name (auto-generated if empty)"
                  />
                </div>

                {/* Names */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Name (RU)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.nameRu}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, nameRu: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="Название категории"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Name (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.nameEn}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, nameEn: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Name (UZ)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.nameUz}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, nameUz: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="Kategoriya nomi"
                  />
                </div>

                {/* Image URL (optional) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2A2A2A]/60 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={categoryFormData.imageUrl}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, imageUrl: e.target.value })}
                    className="w-full p-3 border border-[#2A2A2A]/20 focus:border-[#C4A265] outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2A2A2A] text-white py-3 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Create Category
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
                  onClick={() => handleDeleteProduct(deleteConfirmId)}
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
