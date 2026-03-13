'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t.auth.enterEmail);
      return;
    }

    if (!password) {
      setError(t.auth.enterPassword);
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/');
    } else {
      setError(t.auth.invalidCredentials);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-[#2A2A2A] hover:text-[#C4A265] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-wider">{t.common.backToShop}</span>
        </Link>

        <h1 className="font-serif text-3xl text-center text-[#2A2A2A] tracking-widest">
          PHYTOTREE
        </h1>
        <h2 className="mt-6 text-center text-xl text-[#2A2A2A]">
          {t.auth.loginTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-[#2A2A2A]/60">
          {t.auth.noAccount}{' '}
          <Link href="/register" className="text-[#C4A265] hover:underline">
            {t.auth.register}
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-sm border border-[#2A2A2A]/10 sm:rounded-sm sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
              >
                {t.auth.email}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-[#2A2A2A]/20 bg-transparent placeholder-[#2A2A2A]/40 text-[#2A2A2A] focus:outline-none focus:ring-1 focus:ring-[#C4A265] focus:border-[#C4A265] transition-colors"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
              >
                {t.auth.password}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pr-10 border border-[#2A2A2A]/20 bg-transparent placeholder-[#2A2A2A]/40 text-[#2A2A2A] focus:outline-none focus:ring-1 focus:ring-[#C4A265] focus:border-[#C4A265] transition-colors"
                  placeholder={t.auth.enterPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2A2A2A]/40 hover:text-[#2A2A2A]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium uppercase tracking-wider text-white bg-[#2A2A2A] hover:bg-[#C4A265] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4A265] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t.auth.login
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A2A]/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#2A2A2A]/40">
                  {t.auth.testAdmin}
                </span>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-[#2A2A2A]/60">
              <p>Email: admin@phytotree.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
