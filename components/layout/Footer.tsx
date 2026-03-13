'use client';

import { useI18n } from '@/contexts/I18nContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-[#2A2A2A] text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl tracking-widest mb-4">
              PHYTOTREE
            </h2>
            <p className="text-white/60 text-sm max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="uppercase tracking-wider text-sm font-medium mb-4">
              {t.footer.shop}
            </h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.nav.skincare}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.nav.makeup}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.nav.fragrance}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.nav.hairCare}</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="uppercase tracking-wider text-sm font-medium mb-4">
              {t.footer.help}
            </h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.footer.about}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.footer.faq}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.footer.shippingReturns}</a></li>
              <li><a href="#" className="hover:text-[#C4A265] transition-colors">{t.footer.contact}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Phytotree. {t.footer.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
