'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X, Shield, LogOut, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navbar({
  cartItemCount,
  onCartClick,
}: NavbarProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, locale, setLocale, locales, currentLocaleInfo } = useI18n();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const NAV_LINKS = [
    { label: t.nav.shopAll, href: '/' },
    { label: t.nav.skincare, href: '/' },
    { label: t.nav.makeup, href: '/' },
    { label: t.nav.fragrance, href: '/' },
    { label: t.nav.hairCare, href: '/' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#2A2A2A]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none md:justify-start">
            <Link href="/" className="font-serif text-2xl tracking-widest text-[#2A2A2A] font-bold">
              PHYTOTREE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center justify-center flex-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#2A2A2A] text-sm uppercase tracking-wider hover:text-[#C4A265] transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4A265] transition-all group-hover:w-full duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors flex items-center gap-1"
              >
                <Globe size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline text-sm uppercase">{locale}</span>
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-44 bg-white shadow-xl border border-[#2A2A2A]/5 rounded-sm overflow-hidden z-50"
                    >
                      <div className="py-1">
                        {locales.map((loc) => (
                          <button
                            key={loc.code}
                            onClick={() => {
                              setLocale(loc.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                              locale === loc.code ? 'text-[#C4A265]' : 'text-[#2A2A2A]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{loc.flag}</span>
                              <span>{loc.name}</span>
                            </span>
                            {locale === loc.code && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors hidden sm:block">
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors flex items-center gap-2"
              >
                <User size={20} strokeWidth={1.5} />
                {isAuthenticated && (
                  <span className="hidden sm:block text-sm">
                    {user?.name}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-56 bg-white shadow-xl border border-[#2A2A2A]/5 rounded-sm overflow-hidden z-50"
                    >
                      {isAuthenticated ? (
                        <div className="py-2">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-[#2A2A2A]/10">
                            <p className="text-sm font-medium text-[#2A2A2A]">{user?.name}</p>
                            <p className="text-xs text-[#2A2A2A]/60">{user?.email}</p>
                            {isAdmin && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-[#C4A265]/10 text-[#C4A265] text-xs rounded-sm">
                                {t.auth.administrator}
                              </span>
                            )}
                          </div>

                          <Link
                            href="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#FAF7F2] hover:text-[#C4A265]"
                          >
                            {t.userMenu.myOrders}
                          </Link>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#FAF7F2] hover:text-[#C4A265]"
                            >
                              <Shield size={14} />
                              {t.nav.adminPanel}
                            </Link>
                          )}

                          <div className="border-t border-[#2A2A2A]/10 my-1" />

                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <LogOut size={14} />
                            {t.auth.logout}
                          </button>
                        </div>
                      ) : (
                        <div className="py-2">
                          <Link
                            href="/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#FAF7F2] hover:text-[#C4A265]"
                          >
                            {t.auth.login}
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#FAF7F2] hover:text-[#C4A265]"
                          >
                            {t.auth.register}
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="text-[#2A2A2A] hover:text-[#C4A265] transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C4A265] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#2A2A2A]/5"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[#2A2A2A] text-sm uppercase tracking-wider hover:text-[#C4A265] transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block text-[#2A2A2A] text-sm uppercase tracking-wider hover:text-[#C4A265] transition-colors"
                >
                  {t.nav.adminPanel}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
