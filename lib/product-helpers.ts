import type { Product, Category, CartItem, WishlistItem } from './api/types';

export type Locale = 'ru' | 'en' | 'uz';

/**
 * Get localized product name based on current locale
 */
export function getProductName(product: Product | CartItem['product'] | WishlistItem['product'], locale: Locale): string {
  switch (locale) {
    case 'en':
      return product.nameEn;
    case 'uz':
      return product.nameUz;
    case 'ru':
    default:
      return product.nameRu;
  }
}

/**
 * Get localized product description based on current locale
 */
export function getProductDescription(product: Product, locale: Locale): string | null {
  switch (locale) {
    case 'en':
      return product.descriptionEn;
    case 'uz':
      return product.descriptionUz;
    case 'ru':
    default:
      return product.descriptionRu;
  }
}

/**
 * Get localized category name based on current locale
 */
export function getCategoryName(
  category: Category | Product['category'] | CartItem['product']['category'],
  locale: Locale
): string {
  switch (locale) {
    case 'en':
      return category.nameEn;
    case 'uz':
      return category.nameUz;
    case 'ru':
    default:
      return category.nameRu;
  }
}

/**
 * Get product price as number (backend returns string for Decimal)
 */
export function getProductPrice(product: Product | CartItem['product'] | WishlistItem['product']): number {
  return parseFloat(product.price);
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | string, currency: string = '$'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${currency}${numPrice.toFixed(2)}`;
}

/**
 * Get first product image or fallback gradient
 */
export function getProductImage(product: Product | CartItem['product'] | WishlistItem['product']): string {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  // Fallback gradient for products without images
  return 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)';
}

/**
 * Check if image is a CSS gradient
 */
export function isGradient(image: string): boolean {
  return image.startsWith('linear-gradient') || image.startsWith('radial-gradient');
}
