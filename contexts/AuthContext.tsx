'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authApi, setAccessToken } from '@/lib/api';
import type { User, AuthInitResponse } from '@/lib/api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Telegram auth flow
  initTelegramLogin: () => Promise<AuthInitResponse>;
  checkAuthStatus: (authToken: string) => Promise<boolean>;
  finalizeTelegramLogin: (authToken: string) => Promise<{ success: boolean; error?: string }>;

  // Session management
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<{ sessionsInvalidated: number }>;

  // Refresh user data
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Try to refresh token (stored in httpOnly cookie)
        const refreshResult = await authApi.refresh();

        if (refreshResult) {
          // Token refreshed, get user data
          const userData = await authApi.me();
          setUser(userData);
        }
      } catch {
        // No valid session, user needs to log in
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Initialize Telegram login flow
   * Returns authToken and deepLink for QR code or button
   */
  const initTelegramLogin = useCallback(async (): Promise<AuthInitResponse> => {
    const response = await authApi.init();
    return response;
  }, []);

  /**
   * Check if user has confirmed auth in Telegram
   * Used for polling while waiting for confirmation
   */
  const checkAuthStatus = useCallback(async (authToken: string): Promise<boolean> => {
    try {
      // Try to finalize - if user confirmed, this will succeed
      const response = await authApi.finalize(authToken);
      setUser(response.user);
      return true;
    } catch {
      // Not confirmed yet or expired
      return false;
    }
  }, []);

  /**
   * Finalize Telegram login after user confirms
   */
  const finalizeTelegramLogin = useCallback(async (
    authToken: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.finalize(authToken);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete login';
      return { success: false, error: message };
    }
  }, []);

  /**
   * Logout from current device
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  /**
   * Logout from all devices
   */
  const logoutAllDevices = useCallback(async () => {
    const result = await authApi.logoutAll();
    setUser(null);
    return result;
  }, []);

  /**
   * Refresh user data from server
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        initTelegramLogin,
        checkAuthStatus,
        finalizeTelegramLogin,
        logout,
        logoutAllDevices,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Generate Telegram deep link for login
 */
export function getTelegramDeepLink(authToken: string): string {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${authToken}`;
}

/**
 * Generate Telegram QR code URL (using QR code API)
 */
export function getTelegramQRCodeUrl(deepLink: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deepLink)}`;
}
