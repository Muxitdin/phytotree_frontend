import { api, setAccessToken } from './client';
import type { AuthInitResponse, AuthFinalizeResponse, User } from './types';

export const authApi = {
  /**
   * Initialize Telegram login flow
   * Returns authToken and Telegram deep link
   */
  init: () => api.post<AuthInitResponse>('/auth/init', undefined, { skipAuth: true }),

  /**
   * Finalize auth after user confirms in Telegram
   * Returns JWT access token and user data
   */
  finalize: async (authToken: string): Promise<AuthFinalizeResponse> => {
    const response = await api.post<AuthFinalizeResponse>(
      '/auth/finalize',
      { authToken },
      { skipAuth: true }
    );

    // Store access token
    setAccessToken(response.accessToken);

    return response;
  },

  /**
   * Refresh access token using httpOnly cookie
   */
  refresh: async (): Promise<{ accessToken: string; expiresIn: number } | null> => {
    try {
      const response = await api.post<{ accessToken: string; expiresIn: number }>(
        '/auth/refresh',
        undefined,
        { skipAuth: true }
      );

      setAccessToken(response.accessToken);
      return response;
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  /**
   * Get current user
   */
  me: () => api.get<User>('/auth/me'),

  /**
   * Logout from current device
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', undefined, { skipAuth: true });
    } finally {
      setAccessToken(null);
    }
  },

  /**
   * Logout from all devices
   */
  logoutAll: async (): Promise<{ sessionsInvalidated: number }> => {
    const response = await api.post<{ success: boolean; sessionsInvalidated: number }>(
      '/auth/logout-all'
    );
    setAccessToken(null);
    return { sessionsInvalidated: response.sessionsInvalidated };
  },
};
