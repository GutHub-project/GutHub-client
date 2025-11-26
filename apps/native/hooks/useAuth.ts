import { useState } from 'react';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { EmailLoginRequest, SocialProvider } from '../types/auth';

export const useAuth = () => {
  const { setAuth, clearAuth, loadAuth, isAuthenticated, loginType } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: EmailLoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = authService.mockEmailLogin(credentials);

      await setAuth(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        'email'
      );

      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: SocialProvider, _providerAccessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = authService.mockSocialLogin(provider);

      await setAuth(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        'social',
        provider
      );

      return response.user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '소셜 로그인에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await clearAuth();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      await loadAuth();
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    socialLogin,
    logout,
    initializeAuth,
    isLoading,
    error,
    isAuthenticated,
    loginType,
  };
};
