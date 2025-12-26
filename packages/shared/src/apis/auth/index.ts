import { publicApiInstance, privateApiInstance } from '../instance';
import type {
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SocialProvider,
} from '../../types';

/**
 * 인증 관련 API 함수들
 */
export const authApi = {
  /**
   * 소셜 로그인
   * @param provider - 소셜 로그인 제공자 (google, kakao, naver)
   * @param accessToken - 소셜 제공자로부터 받은 액세스 토큰
   * @param idToken - (선택) ID 토큰 (Google의 경우)
   * @returns 인증 토큰 및 사용자 정보
   */
  socialLogin: async (request: {
    provider: SocialProvider;
    accessToken: string;
    idToken?: string;
  }): Promise<AuthResponse> => {
    const response = await publicApiInstance.post<AuthResponse>(
      '/auth/social-login',
      request
    );
    return response.data;
  },

  /**
   * 회원가입 완료
   * @param data - 회원가입 완료 데이터
   * @param tempToken - 임시 인증 토큰 (Bearer Token으로 전송)
   * @returns 인증 토큰 및 사용자 정보
   */
  completeSignup: async (data: any, tempToken: string): Promise<AuthResponse> => {
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
   * @returns 새로운 액세스 토큰
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await publicApiInstance.post<RefreshTokenResponse>(
      '/jwt/refresh',
      {} // 리프레시 토큰은 쿠키로 전송되므로 body는 비어있음
    );
    return response.data;
  },

  /**
   * 로그아웃
   * @returns 성공 여부
   */
  logout: async (): Promise<void> => {
    await privateApiInstance.post('/logout');
  },
};
