import { publicApiInstance, privateApiInstance, BASE_URL, WEB_URL } from '@repo/shared';
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
   * 웹뷰에 띄울 URL 반환 (하이브리드 웹앱)
   * @returns 웹뷰에 띄울 웹 URL
   */
  getSocialLoginUrl: (): string => {
    console.log('[authApi] Using WEB_URL:', WEB_URL);
    // 하이브리드 웹앱 - 메인 페이지
    return WEB_URL;
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
