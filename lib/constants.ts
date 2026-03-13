import { Product } from './types';

export const CATEGORIES = [
  'All',
  'Skincare',
  'Makeup',
  'Fragrance',
  'Hair Care',
  'Body Care',
  'Tools & Accessories',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ITEMS_PER_PAGE = 9;

export const INITIAL_PRODUCTS: Product[] = [
  // Skincare
  {
    id: '1',
    brand: 'La Lumière',
    name: 'Velvet Rose Serum',
    price: 125,
    category: 'Skincare',
    imageColor: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  },
  {
    id: '2',
    brand: 'Éclat Doré',
    name: 'Midnight Recovery Oil',
    price: 85,
    category: 'Skincare',
    imageColor: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
  },
  {
    id: '3',
    brand: 'Pure Essence',
    name: 'Hydrating Silk Cream',
    price: 95,
    category: 'Skincare',
    imageColor: 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)',
  },
  {
    id: '4',
    brand: 'La Lumière',
    name: 'Radiance Eye Contour',
    price: 75,
    category: 'Skincare',
    imageColor: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
  },

  // Makeup
  {
    id: '5',
    brand: 'Visage',
    name: 'Satin Finish Foundation',
    price: 65,
    category: 'Makeup',
    imageColor: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: '6',
    brand: 'Noir',
    name: 'Volumizing Mascara',
    price: 32,
    category: 'Makeup',
    imageColor: 'linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%)',
  },
  {
    id: '7',
    brand: 'Rouge',
    name: 'Matte Lipstick - Bordeaux',
    price: 38,
    category: 'Makeup',
    imageColor: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: '8',
    brand: 'Visage',
    name: 'Luminous Bronzing Powder',
    price: 55,
    category: 'Makeup',
    imageColor: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
  },

  // Fragrance
  {
    id: '9',
    brand: 'Maison Scent',
    name: 'Oud & Bergamot',
    price: 180,
    category: 'Fragrance',
    imageColor: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
  },
  {
    id: '10',
    brand: 'Fleur',
    name: 'Jasmine Absolute',
    price: 145,
    category: 'Fragrance',
    imageColor: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    id: '11',
    brand: 'Maison Scent',
    name: 'Amber Woods',
    price: 165,
    category: 'Fragrance',
    imageColor:
      'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
  },

  // Hair Care
  {
    id: '12',
    brand: 'Cheveux',
    name: 'Restorative Hair Mask',
    price: 58,
    category: 'Hair Care',
    imageColor: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  },
  {
    id: '13',
    brand: 'Cheveux',
    name: 'Silk Finish Serum',
    price: 45,
    category: 'Hair Care',
    imageColor: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
  },

  // Body Care
  {
    id: '14',
    brand: 'Corps',
    name: 'Whipped Body Butter',
    price: 42,
    category: 'Body Care',
    imageColor: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
  },
  {
    id: '15',
    brand: 'Corps',
    name: 'Exfoliating Sugar Scrub',
    price: 36,
    category: 'Body Care',
    imageColor: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  },

  // Tools
  {
    id: '16',
    brand: 'Artisan',
    name: 'Rose Quartz Roller',
    price: 28,
    category: 'Tools & Accessories',
    imageColor: 'linear-gradient(to top, #96fbc4 0%, #f9f586 100%)',
  },
  {
    id: '17',
    brand: 'Artisan',
    name: 'Precision Brush Set',
    price: 85,
    category: 'Tools & Accessories',
    imageColor: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)',
  },
  {
    id: '18',
    brand: 'Artisan',
    name: 'Silk Sleep Mask',
    price: 45,
    category: 'Tools & Accessories',
    imageColor: 'linear-gradient(to top, #dfe9f3 0%, white 100%)',
  },
];
