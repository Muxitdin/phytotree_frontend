import { Dictionary } from './ru';

export const uz: Dictionary = {
  // Common
  common: {
    backToShop: 'Do\'konga qaytish',
    loading: 'Yuklanmoqda...',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    delete: 'O\'chirish',
    edit: 'Tahrirlash',
    add: 'Qo\'shish',
    search: 'Qidirish',
    all: 'Hammasi',
    free: 'Bepul',
    total: 'Jami',
    subtotal: 'Oraliq jami',
    shipping: 'Yetkazib berish',
    quantity: 'Miqdor',
    price: 'Narx',
    category: 'Kategoriya',
    actions: 'Harakatlar',
    product: 'Mahsulot',
    products: 'Mahsulotlar',
    confirmDelete: 'O\'chirishni tasdiqlang',
    deleteWarning: 'Ushbu mahsulotni o\'chirishni xohlaysizmi? Bu amalni bekor qilib bo\'lmaydi.',
  },

  // Navigation
  nav: {
    shopAll: 'Barcha mahsulotlar',
    skincare: 'Teri parvarishi',
    makeup: 'Makiyaj',
    fragrance: 'Parfyumeriya',
    hairCare: 'Soch parvarishi',
    bodyCare: 'Tana parvarishi',
    toolsAccessories: 'Asboblar',
    adminPanel: 'Admin panel',
  },

  // Categories
  categories: {
    all: 'Hammasi',
    skincare: 'Teri parvarishi',
    makeup: 'Makiyaj',
    fragrance: 'Parfyumeriya',
    hairCare: 'Soch parvarishi',
    bodyCare: 'Tana parvarishi',
    toolsAccessories: 'Asboblar va aksessuarlar',
  },

  // Auth
  auth: {
    login: 'Kirish',
    logout: 'Chiqish',
    loginTitle: 'Hisobingizga kiring',
    loginSubtitle: 'Hisobingizga kirish uchun Telegram orqali kiring',
    telegramLogin: 'Telegram orqali kirish',
    openTelegram: 'Telegramni ochish',
    scanQrCode: 'QR kodni skanerlang',
    orClickButton: 'yoki quyidagi tugmani bosing',
    waitingConfirmation: 'Tasdiqlash kutilmoqda...',
    confirmInTelegram: 'Telegram botda kirishni tasdiqlang',
    loginExpired: 'Sessiya muddati tugadi',
    tryAgain: 'Qayta urinish',
    loginError: 'Kirish xatosi',
    loginSuccess: 'Kirish muvaffaqiyatli!',
    redirecting: 'Yo\'naltirilmoqda...',
    administrator: 'Administrator',
    secureLogin: 'Telegram orqali xavfsiz kirish',
    noDataShared: 'Biz parolingizni saqlamaymiz',
  },

  // Cart
  cart: {
    title: 'Savatingiz',
    empty: 'Savatingiz bo\'sh',
    continueShopping: 'Xarid qilishni davom ettirish',
    checkout: 'Buyurtma berish',
    addToCart: 'Savatga qo\'shish',
    added: 'Qo\'shildi',
    freeShippingNote: 'Bepul yetkazib berish uchun yana ${amount} qo\'shing',
  },

  // Product
  product: {
    notFound: 'Mahsulot topilmadi',
    brand: 'Brend',
    name: 'Mahsulot nomi',
    description: '{brand} dan hashamatli mahsulot, tabiiy go\'zalligingizni ta\'kidlash uchun yaratilgan. Ajoyib natijalar uchun yuqori sifatli ingredientlardan tayyorlangan.',
    relatedProducts: 'O\'xshash mahsulotlar',
    features: {
      freeShipping: '$100 dan bepul yetkazib berish',
      returns: '30 kunlik qaytarish',
      quality: 'Sifat kafolati',
      securePayment: 'Xavfsiz to\'lov',
    },
    imageColor: 'Rasm rangi (CSS gradient)',
  },

  // Sidebar / Filters
  filters: {
    categories: 'Kategoriyalar',
    priceRange: 'Narx diapazoni',
    minPrice: 'Min',
    maxPrice: 'Maks',
  },

  // Pagination
  pagination: {
    previous: 'Oldingi',
    next: 'Keyingi',
    page: 'Sahifa',
    of: 'dan',
  },

  // Admin
  admin: {
    title: 'Admin panel',
    addProduct: 'Mahsulot qo\'shish',
    editProduct: 'Mahsulotni tahrirlash',
    newProduct: 'Yangi mahsulot',
    productManagement: 'Mahsulotlarni boshqarish',
    totalProducts: 'Jami mahsulotlar',
    totalCategories: 'Kategoriyalar',
    totalValue: 'Umumiy qiymat',
    noProducts: 'Mahsulotlar topilmadi',
    addFirstProduct: 'Birinchi mahsulotni qo\'shing',
    createProduct: 'Mahsulot yaratish',
    saveChanges: 'O\'zgarishlarni saqlash',
  },

  // Checkout
  checkout: {
    title: 'Buyurtma berish',
    shippingDetails: 'Yetkazib berish ma\'lumotlari',
    yourOrder: 'Buyurtmangiz',
    fullName: 'To\'liq ism',
    phone: 'Telefon',
    address: 'Yetkazib berish manzili',
    city: 'Shahar',
    postalCode: 'Pochta indeksi',
    placeOrder: 'Buyurtma berish',
    processing: 'Qayta ishlanmoqda...',
    orderSuccess: 'Buyurtma muvaffaqiyatli berildi!',
    orderNumber: 'Buyurtma raqami',
    confirmationSent: 'Emailingizga tasdiqlash xabari yuborildi',
    validation: {
      enterName: 'Qabul qiluvchi ismini kiriting',
      enterPhone: 'Telefon raqamini kiriting',
      enterAddress: 'Yetkazib berish manzilini kiriting',
      enterCity: 'Shaharni kiriting',
      enterPostalCode: 'Pochta indeksini kiriting',
    },
  },

  // Orders
  orders: {
    title: 'Mening buyurtmalarim',
    empty: 'Sizda hali buyurtmalar yo\'q',
    emptyDescription: 'Xarid qilishni boshlang va buyurtmalaringiz shu yerda ko\'rinadi',
    goToShop: 'Do\'konga o\'tish',
    orderNumber: 'Buyurtma',
    orderDetails: 'Buyurtma tafsilotlari',
    shippingAddress: 'Yetkazib berish manzili',
    item: 'mahsulot',
    items: 'mahsulotlar',
    status: {
      pending: 'Kutilmoqda',
      processing: 'Qayta ishlanmoqda',
      shipped: 'Yuborildi',
      delivered: 'Yetkazildi',
      cancelled: 'Bekor qilindi',
    },
  },

  // Hero Banner
  hero: {
    title: 'Kashf eting',
    subtitle: 'Tabiiy go\'zallik hashamati',
    description: 'Mukammalligingiz uchun premium kosmetika',
    shopNow: 'Kolleksiyani ko\'rish',
  },

  // Footer
  footer: {
    description: 'Premium kosmetika va go\'zallik mahsulotlari',
    shop: 'Do\'kon',
    help: 'Yordam',
    contact: 'Aloqa',
    about: 'Biz haqimizda',
    faq: 'FAQ',
    shippingReturns: 'Yetkazib berish va qaytarish',
    privacyPolicy: 'Maxfiylik siyosati',
    allRightsReserved: 'Barcha huquqlar himoyalangan',
  },

  // User menu
  userMenu: {
    myOrders: 'Mening buyurtmalarim',
  },
};
