import { useState } from 'react';
import { useAuthStore } from '../stores';
import type { SocialProvider } from '../types';

/**
 * 소셜 로그인 훅
 *
 * 사용 예시:
 * ```tsx
 * import { authApi } from '@repo/main-feature/apis/auth';
 * const { login, isLoading, error } = useSocialLogin(authApi);
 *
 * const handleGoogleLogin = async () => {
 *   await login('google', googleAccessToken);
 * };
 * ```
 */
export const useSocialLogin = (authApi: {
  socialLogin: (request: {
    provider: SocialProvider;
    accessToken: string;
    idToken?: string;
  }) => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthState, setLoading } = useAuthStore();

  /**
   * 소셜 로그인 실행
   * @param provider - 소셜 로그인 제공자 (google, kakao, naver)
   * @param accessToken - 소셜 제공자로부터 받은 액세스 토큰
   * @param idToken - (선택) ID 토큰 (Google, Apple의 경우)
   */
  const login = async (
    provider: SocialProvider,
    accessToken: string,
    idToken?: string
  ) => {
    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.socialLogin({
        provider,
        accessToken,
        idToken,
      });

      // Zustand store에 인증 정보 저장
      setAuthState(response);

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
