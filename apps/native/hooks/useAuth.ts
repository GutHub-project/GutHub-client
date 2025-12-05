/**
 * ============================================================
 * 인증 훅 (useAuth)
 * ============================================================
 *
 * OAuth2 소셜 로그인 플로우를 처리하는 커스텀 훅
 *
 * 사용 예시:
 * ```tsx
 * const { socialLogin, logout, isAuthenticated, isLoading } = useAuth();
 *
 * // 소셜 로그인 버튼 클릭 시
 * const handleGoogleLogin = () => socialLogin('google');
 * ```
 *
 * ============================================================
 */

import { useState } from 'react';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { EmailLoginRequest, SocialProvider } from '../types/auth';

export const useAuth = () => {
  const { setAuth, clearAuth, loadAuth, isAuthenticated, loginType } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ============================================================
   * 이메일 로그인
   * ============================================================
   *
   * TODO: 이메일 로그인 기능 필요 시 활성화
   *       현재는 소셜 로그인만 지원 예정
   */
  const login = async (credentials: EmailLoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 연동 시 authService.emailLogin() 사용
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

  /**
   * ============================================================
   * 소셜 로그인 (OAuth2)
   * ============================================================
   *
   * [현재 상태] Mock 데이터 사용 중
   *
   * [실제 구현 시 플로우]
   *
   * 1단계: 사용자가 소셜 로그인 버튼 클릭
   *   - 이 함수가 호출됨
   *
   * 2단계: OAuth2 인증 URL로 이동
   *   - expo-web-browser 또는 expo-auth-session 사용
   *   - authService.getOAuthURL(provider) 호출하여 URL 획득
   *   - 백엔드 /oauth2/authorization/{provider}로 리디렉션
   *
   * 3단계: 백엔드 처리 후 리디렉션
   *   - 백엔드가 소셜 인증 완료
   *   - SocialSuccessHandler가 refreshToken을 쿠키에 담아 리디렉션
   *   - 리디렉션 URL에서 refreshToken 추출
   *
   * 4단계: accessToken 발급 요청
   *   - authService.getAccessToken(refreshToken) 호출
   *   - /jwt/refresh API로 accessToken 발급받음
   *
   * 5단계: 토큰 저장 및 상태 업데이트
   *   - SecureStore에 토큰 저장
   *   - Zustand store 상태 업데이트
   *
   * TODO: 백엔드 완성 후 아래 실제 구현으로 교체
   *
   * ```typescript
   * const socialLogin = async (provider: SocialProvider) => {
   *   setIsLoading(true);
   *   setError(null);
   *
   *   try {
   *     // 1. OAuth URL 생성
   *     const authUrl = authService.getOAuthURL(provider);
   *
   *     // 2. WebBrowser로 OAuth 플로우 시작
   *     // TODO: expo-web-browser 또는 expo-auth-session 설치 필요
   *     // const result = await WebBrowser.openAuthSessionAsync(
   *     //   authUrl,
   *     //   'your-app-scheme://login/success'
   *     // );
   *
   *     // 3. 리디렉션 URL에서 refreshToken 추출
   *     // TODO: 백엔드 리디렉션 방식에 따라 파싱 로직 구현
   *     // const refreshToken = parseRefreshTokenFromUrl(result.url);
   *
   *     // 4. refreshToken으로 accessToken 발급
   *     // const { accessToken } = await authService.getAccessToken(refreshToken);
   *
   *     // 5. 토큰 저장
   *     // await setAuth({ accessToken, refreshToken }, 'social', provider);
   *
   *   } catch (err) {
   *     const errorMessage = err instanceof Error ? err.message : '소셜 로그인에 실패했습니다.';
   *     setError(errorMessage);
   *     throw err;
   *   } finally {
   *     setIsLoading(false);
   *   }
   * };
   * ```
   *
   * @param provider - 소셜 로그인 제공자 ('google' | 'kakao' | 'naver')
   * @param _providerAccessToken - (현재 미사용) 소셜 제공자에서 받은 토큰
   */
  const socialLogin = async (provider: SocialProvider, _providerAccessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 백엔드 완성 후 실제 OAuth2 플로우로 교체
      // 현재는 Mock 데이터 사용
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

  /**
   * ============================================================
   * 로그아웃
   * ============================================================
   *
   * TODO: 백엔드 로그아웃 API 연동
   *       - 서버에 refreshToken 삭제 요청
   *       - 로컬 토큰 삭제
   */
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 백엔드 로그아웃 API 호출
      // const { tokens } = useAuthStore.getState();
      // if (tokens?.refreshToken) {
      //   await authService.logout(tokens.refreshToken);
      // }

      // 로컬 상태 및 저장소 클리어
      await clearAuth();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ============================================================
   * 인증 상태 초기화
   * ============================================================
   *
   * 앱 시작 시 SecureStore에서 저장된 토큰을 불러와서
   * 인증 상태를 복원
   *
   * TODO: 토큰 유효성 검증 추가
   *       - accessToken 만료 확인
   *       - 만료 시 refreshToken으로 갱신
   */
  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      // SecureStore에서 저장된 토큰 로드
      await loadAuth();

      // TODO: 토큰 유효성 검증
      // const { tokens } = useAuthStore.getState();
      // if (tokens && isTokenExpired(tokens.accessToken)) {
      //   // accessToken 만료 시 갱신 시도
      //   const { accessToken } = await authService.refreshToken(tokens.refreshToken);
      //   await useAuthStore.getState().updateAccessToken(accessToken);
      // }
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    /** 이메일 로그인 (TODO: 필요 시 활성화) */
    login,
    /** 소셜 로그인 (OAuth2) */
    socialLogin,
    /** 로그아웃 */
    logout,
    /** 앱 시작 시 인증 상태 초기화 */
    initializeAuth,
    /** 로딩 상태 */
    isLoading,
    /** 에러 메시지 */
    error,
    /** 인증 여부 */
    isAuthenticated,
    /** 로그인 타입 ('email' | 'social') */
    loginType,
  };
};
