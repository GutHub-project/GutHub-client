import { publicApiInstance, privateApiInstance, BASE_URL } from '@repo/shared';
import type {
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@repo/shared';

/**
 * 인증 관련 API
 */
export const authApi = {
  /**
   * 소셜 로그인 URL 생성
   * @param provider - 소셜 로그인 제공자 (naver, google, kakao)
   * @returns 리다이렉트할 OAuth URL
   */
  getSocialLoginUrl: (provider: 'naver' | 'google' | 'kakao'): string => {
    const redirectUri = encodeURIComponent('com.guthub://auth-callback');
    console.log('[authApi] Using BASE_URL:', BASE_URL);
    return `${BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${redirectUri}`;
  },

  /**
   * 회원가입 완료
   * @param data - 회원가입 완료 데이터
   * @param tempToken - 임시 인증 토큰 (Bearer Token으로 전송)
   */
  completeSignup: async (data: any, tempToken: string) => {
    const response = await publicApiInstance.post<AuthResponse>(
      '/auth/signup/complete',
      data,
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * 리프레시 토큰으로 액세스 토큰 갱신
   * 리프레시 토큰은 쿠키로 자동 전송됨
   */
  refreshToken: async () => {
    const response = await publicApiInstance.post<RefreshTokenResponse>(
      '/jwt/refresh',
      {}
    );
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    await privateApiInstance.post('/logout');
  },
};
