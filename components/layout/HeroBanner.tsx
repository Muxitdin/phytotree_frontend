'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

export function HeroBanner() {
  const { t } = useI18n();

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#EBE5CE]">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #EBE5CE 0%, #D4C5A9 100%)',
          opacity: 0.8,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <span className="text-[#2A2A2A] uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            {t.hero.title}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-[#2A2A2A] leading-tight mb-6">
            {t.hero.subtitle.split(' ').slice(0, 2).join(' ')} <br />
            <span className="italic text-[#C4A265]">{t.hero.subtitle.split(' ').slice(2).join(' ')}</span>
          </h1>
          <p className="text-[#2A2A2A]/80 text-lg md:text-xl mb-10 max-w-lg font-light leading-relaxed">
            {t.hero.description}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#2A2A2A] text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#C4A265] transition-colors duration-300"
          >
            {t.hero.shopNow}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
