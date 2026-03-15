'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, RefreshCw, CheckCircle, Send, Shield } from 'lucide-react';
import { useAuth, getTelegramQRCodeUrl } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

type LoginState = 'idle' | 'loading' | 'waiting' | 'success' | 'error' | 'expired';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, initTelegramLogin, checkAuthStatus } = useAuth();
  const { t } = useI18n();

  const [state, setState] = useState<LoginState>('idle');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Initialize Telegram login
  const initLogin = useCallback(async () => {
    setState('loading');
    setError(null);

    try {
      const response = await initTelegramLogin();
      setAuthToken(response.authToken);
      setDeepLink(response.deepLink);
      setQrCodeUrl(getTelegramQRCodeUrl(response.deepLink));
      setExpiresAt(Date.now() + response.expiresIn * 1000);
      setState('waiting');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.loginError);
      setState('error');
    }
  }, [initTelegramLogin, t.auth.loginError]);

  // Start login on mount
  useEffect(() => {
    if (state === 'idle' && !isAuthenticated) {
      initLogin();
    }
  }, [state, isAuthenticated, initLogin]);

  // Poll for auth confirmation
  useEffect(() => {
    if (state !== 'waiting' || !authToken) return;

    const pollInterval = setInterval(async () => {
      const confirmed = await checkAuthStatus(authToken);
      if (confirmed) {
        setState('success');
        clearInterval(pollInterval);
        // Redirect after short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [state, authToken, checkAuthStatus, router]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt || state !== 'waiting') return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setState('expired');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, state]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    setAuthToken(null);
    setDeepLink(null);
    setQrCodeUrl(null);
    setExpiresAt(null);
    setTimeLeft(null);
    initLogin();
  };

  if (isAuthenticated) {
    return null;
  }

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
          {t.auth.loginSubtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-sm border border-[#2A2A2A]/10 sm:rounded-sm sm:px-10">
          {/* Loading state */}
          {state === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-[#C4A265]" size={40} />
              <p className="mt-4 text-[#2A2A2A]/60">{t.common.loading}</p>
            </div>
          )}

          {/* Waiting for confirmation */}
          {state === 'waiting' && qrCodeUrl && deepLink && (
            <div className="flex flex-col items-center">
              {/* QR Code */}
              <div className="relative">
                <div className="bg-white p-4 rounded-lg border-2 border-[#2A2A2A]/10">
                  <Image
                    src={qrCodeUrl}
                    alt="Telegram QR Code"
                    width={200}
                    height={200}
                    className="rounded"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#C4A265] text-white text-xs px-3 py-1 rounded-full">
                  {t.auth.scanQrCode}
                </div>
              </div>

              <p className="mt-6 text-sm text-[#2A2A2A]/60 text-center">
                {t.auth.orClickButton}
              </p>

              {/* Open Telegram button */}
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium uppercase tracking-wider text-white bg-[#0088cc] hover:bg-[#0077b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0088cc] transition-colors"
              >
                <Send size={18} />
                {t.auth.openTelegram}
              </a>

              {/* Waiting indicator */}
              <div className="mt-6 flex items-center gap-2 text-[#2A2A2A]/60">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">{t.auth.waitingConfirmation}</span>
              </div>

              <p className="mt-2 text-xs text-[#2A2A2A]/40 text-center">
                {t.auth.confirmInTelegram}
              </p>

              {/* Timer */}
              {timeLeft !== null && (
                <div className="mt-4 text-sm text-[#2A2A2A]/40">
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          )}

          {/* Success state */}
          {state === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="text-green-500" size={60} />
              </motion.div>
              <p className="mt-4 text-lg font-medium text-[#2A2A2A]">
                {t.auth.loginSuccess}
              </p>
              <p className="mt-2 text-sm text-[#2A2A2A]/60">
                {t.auth.redirecting}
              </p>
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm w-full text-center">
                {error || t.auth.loginError}
              </div>
              <button
                onClick={handleRetry}
                className="mt-6 flex items-center gap-2 text-[#C4A265] hover:text-[#2A2A2A] transition-colors"
              >
                <RefreshCw size={18} />
                {t.auth.tryAgain}
              </button>
            </div>
          )}

          {/* Expired state */}
          {state === 'expired' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-sm text-sm w-full text-center">
                {t.auth.loginExpired}
              </div>
              <button
                onClick={handleRetry}
                className="mt-6 flex items-center gap-2 py-3 px-6 text-sm font-medium uppercase tracking-wider text-white bg-[#2A2A2A] hover:bg-[#C4A265] transition-colors"
              >
                <RefreshCw size={18} />
                {t.auth.tryAgain}
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-[#2A2A2A]/10">
            <div className="flex items-center justify-center gap-2 text-xs text-[#2A2A2A]/40">
              <Shield size={14} />
              <span>{t.auth.secureLogin}</span>
            </div>
            <p className="mt-1 text-center text-xs text-[#2A2A2A]/30">
              {t.auth.noDataShared}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
