import { publicApiInstance, privateApiInstance } from '../instance';
import type {
  ApiResponse,
  AuthResponse,
  RefreshTokenResponse,
  SocialProvider,
  CompleteSignupRequest,
  CompleteSignupResponse,
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
   * 소셜 회원가입 완료
   * 소셜 로그인 후 추가 정보를 입력하여 회원가입을 완료하고 정식 Access Token을 발급받습니다.
   * @param data - 회원가입 완료 데이터 (nickname, ageRange, gender, gutType)
   * @param tempToken - 임시 인증 토큰 (Bearer Token으로 전송)
   * @returns 정식 액세스 토큰
   */
  completeSignup: async (
    data: CompleteSignupRequest,
    tempToken: string
  ): Promise<CompleteSignupResponse> => {
    console.log('[authApi] completeSignup called');
    const response = await publicApiInstance.post<ApiResponse<CompleteSignupResponse>>(
      '/auth/signup/complete',
      data,
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }
    );
    return response.data.data;
  },

  /**
   * 리프레시 토큰으로 액세스 토큰 갱신
   * - 웹: 리프레시 토큰은 쿠키로 자동 전송
   * - 네이티브: 리프레시 토큰을 body에 담아서 전송
   * @param refreshToken - (네이티브 전용) 저장된 refresh token
   * @returns 새로운 액세스 토큰
   */
  refreshToken: async (refreshToken?: string): Promise<RefreshTokenResponse> => {
    const response = await publicApiInstance.post<ApiResponse<RefreshTokenResponse>>(
      '/jwt/refresh',
      refreshToken ? { refreshToken } : {},
      { withCredentials: true }
    );
    return response.data.data;
  },

  /**
   * 로그아웃
   * @returns 성공 여부
   */
  logout: async (): Promise<void> => {
    await privateApiInstance.post('/logout');
  },
};

/**
 * JWT API
 */
export const jwtApi = {
  /**
   * Access Token 재발급
   * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
   * @param refreshToken - (네이티브 전용) 저장된 refresh token
   * @returns 새로운 액세스 토큰
   */
  refresh: authApi.refreshToken,
};
