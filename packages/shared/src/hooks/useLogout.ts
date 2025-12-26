import { useState } from 'react';
import CookieManager from '@react-native-cookies/cookies';
import { Platform } from 'react-native';
import { useAuthStore } from '../stores';

const isNative = Platform.OS !== 'web';

/**
 * 로그아웃 훅
 *
 * 사용 예시:
 * ```tsx
 * import { authApi } from '@repo/main-feature/apis/auth';
 * const { logout, isLoading } = useLogout(authApi);
 *
 * const handleLogout = async () => {
 *   await logout();
 * };
 * ```
 */
export const useLogout = (authApi: { logout: () => Promise<void> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout: clearAuthState } = useAuthStore();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 서버에 로그아웃 요청
      await authApi.logout();

      // 쿠키 삭제 (Refresh Token 삭제)
      if (isNative) {
        await CookieManager.clearAll();
      }

      // 로컬 상태 초기화 (Access Token 삭제 포함)
      await clearAuthState();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
};
