import { Dictionary } from './ru';

export const en: Dictionary = {
  // Common
  common: {
    backToShop: 'Back to shop',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    all: 'All',
    free: 'Free',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    quantity: 'Quantity',
    price: 'Price',
    category: 'Category',
    actions: 'Actions',
    product: 'Product',
    products: 'Products',
    confirmDelete: 'Confirm deletion',
    deleteWarning: 'Are you sure you want to delete this product? This action cannot be undone.',
  },

  // Navigation
  nav: {
    shopAll: 'Shop All',
    skincare: 'Skincare',
    makeup: 'Makeup',
    fragrance: 'Fragrance',
    hairCare: 'Hair Care',
    bodyCare: 'Body Care',
    toolsAccessories: 'Tools',
    adminPanel: 'Admin Panel',
  },

  // Categories
  categories: {
    all: 'All',
    skincare: 'Skincare',
    makeup: 'Makeup',
    fragrance: 'Fragrance',
    hairCare: 'Hair Care',
    bodyCare: 'Body Care',
    toolsAccessories: 'Tools & Accessories',
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    name: 'Name',
    loginTitle: 'Sign in to your account',
    registerTitle: 'Create an account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    testAdmin: 'Test admin account',
    enterName: 'Enter your name',
    enterEmail: 'Enter email',
    enterPassword: 'Enter password',
    minPassword: 'Minimum 6 characters',
    repeatPassword: 'Repeat password',
    passwordMismatch: 'Passwords do not match',
    invalidCredentials: 'Invalid email or password',
    emailExists: 'User with this email already exists',
    administrator: 'Administrator',
  },

  // Cart
  cart: {
    title: 'Your Cart',
    empty: 'Your cart is empty',
    continueShopping: 'Continue shopping',
    checkout: 'Checkout',
    addToCart: 'Add to Cart',
    added: 'Added',
    freeShippingNote: 'Add ${amount} more for free shipping',
  },

  // Product
  product: {
    notFound: 'Product not found',
    brand: 'Brand',
    name: 'Product name',
    description: 'A luxurious product from {brand}, designed to enhance your natural beauty. Made with premium ingredients for exceptional results.',
    relatedProducts: 'Related Products',
    features: {
      freeShipping: 'Free shipping over $100',
      returns: '30-day returns',
      quality: 'Quality guarantee',
      securePayment: 'Secure payment',
    },
    imageColor: 'Image color (CSS gradient)',
  },

  // Sidebar / Filters
  filters: {
    categories: 'Categories',
    priceRange: 'Price Range',
    minPrice: 'Min',
    maxPrice: 'Max',
  },

  // Pagination
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },

  // Admin
  admin: {
    title: 'Admin Panel',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    newProduct: 'New Product',
    productManagement: 'Product Management',
    totalProducts: 'Total Products',
    totalCategories: 'Categories',
    totalValue: 'Total Value',
    noProducts: 'No products found',
    addFirstProduct: 'Add your first product',
    createProduct: 'Create Product',
    saveChanges: 'Save Changes',
  },

  // Checkout
  checkout: {
    title: 'Checkout',
    shippingDetails: 'Shipping Details',
    yourOrder: 'Your Order',
    fullName: 'Full Name',
    phone: 'Phone',
    address: 'Shipping Address',
    city: 'City',
    postalCode: 'Postal Code',
    placeOrder: 'Place Order',
    processing: 'Processing...',
    orderSuccess: 'Order placed successfully!',
    orderNumber: 'Order number',
    confirmationSent: 'We sent a confirmation to your email',
    validation: {
      enterName: 'Please enter recipient name',
      enterPhone: 'Please enter phone number',
      enterAddress: 'Please enter shipping address',
      enterCity: 'Please enter city',
      enterPostalCode: 'Please enter postal code',
    },
  },

  // Orders
  orders: {
    title: 'My Orders',
    empty: 'You have no orders yet',
    emptyDescription: 'Start shopping and your orders will appear here',
    goToShop: 'Go to Shop',
    orderNumber: 'Order',
    orderDetails: 'Order details',
    shippingAddress: 'Shipping address',
    item: 'item',
    items: 'items',
    status: {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
  },

  // Hero Banner
  hero: {
    title: 'Discover',
    subtitle: 'Natural Luxury Beauty',
    description: 'Premium cosmetics for your perfection',
    shopNow: 'Shop Collection',
  },

  // Footer
  footer: {
    description: 'Premium cosmetics and beauty products',
    shop: 'Shop',
    help: 'Help',
    contact: 'Contact',
    about: 'About Us',
    faq: 'FAQ',
    shippingReturns: 'Shipping & Returns',
    privacyPolicy: 'Privacy Policy',
    allRightsReserved: 'All rights reserved',
  },

  // User menu
  userMenu: {
    myOrders: 'My Orders',
  },
};
