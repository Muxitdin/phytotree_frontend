// Category names for static reference (actual categories come from API)
export const CATEGORY_NAMES = [
  'All',
  'Skincare',
  'Makeup',
  'Fragrance',
  'Hair Care',
  'Body Care',
  'Tools & Accessories',
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export const ITEMS_PER_PAGE = 12;

// Note: Products are now fetched from API via ProductsContext
// INITIAL_PRODUCTS has been removed as we're using real API data
