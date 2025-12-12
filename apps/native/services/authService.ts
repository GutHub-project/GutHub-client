/**
 * ============================================================
 * 인증 서비스 (authService)
 * ============================================================
 *
 * OAuth2 소셜 로그인 전체 플로우:
 *
 * [1단계] 사용자의 시작
 *   - 사용자가 "Google/Kakao로 로그인" 버튼 클릭
 *   - 네이티브 앱에서 WebBrowser 또는 AuthSession을 통해
 *     백엔드의 /oauth2/authorization/{provider} 주소로 이동
 *
 * [2단계] 백엔드의 1차 처리 (리프레시 토큰 발급 및 리디렉션)
 *   - 백엔드가 소셜 Provider(구글/카카오)와 통신하여 사용자 인증 완료
 *   - 백엔드 SocialSuccessHandler 실행:
 *     1) 새로운 refreshToken 생성 → DB(jwt_refresh_entity)에 저장
 *     2) refreshToken을 HttpOnly 쿠키에 담아 전달
 *     3) 프론트엔드 success 페이지로 리디렉션
 *   - ⚠️ 이 단계에서는 accessToken이 전혀 등장하지 않음!
 *
 * [3단계] 프론트엔드의 2차 액션 (액세스 토큰 요청)
 *   - 리디렉션된 success 페이지에서 자동으로 /jwt/refresh API 호출
 *   - 브라우저가 저장해둔 refreshToken 쿠키를 자동으로 헤더에 포함
 *
 * [4단계] 백엔드의 2차 처리 (액세스 토큰 발급)
 *   - /jwt/refresh API가 refreshToken 쿠키 검증
 *   - 검증 성공 시 새로운 accessToken 생성 → JSON 응답으로 전달
 *   - 이 단계에서 비로소 accessToken이 프론트엔드로 전달됨
 *
 * ============================================================
 */

import axios from 'axios';
import Constants from 'expo-constants';

import {
  EmailLoginRequest,
  LoginResponse,
  SocialProvider,
  RefreshTokenResponse,
} from '../types/auth';

/** 회원가입 요청 타입 */
type SignupRequest = {
  username: string;
  password: string;
  nickname: string;
  email: string;
};

/** 공통 응답 래퍼 */
type ApiEnvelope<T> = {
  code: string; // e.g., "SUCCESS"
  message: string;
  data: T;
};

/** 회원가입 응답 데이터 */
type SignupResponseData = {
  userEntityId: string; // 13 chars
};

/** 사용자 정보 조회 응답 데이터 */
type UserProfileResponseData = {
  username: string;
  email: string;
  nickname: string;
  social: boolean;
  gutType?: string;
  imageUrl?: string;
};

/**
 * API 기본 URL
 * TODO: app.json의 extra.apiUrl에 실제 백엔드 URL 설정 필요
 * 예: https://api.guthub.com 또는 개발서버 http://localhost:8080
 */
// 기본 백엔드 URL: 로컬 설정이 없으면 실 서버 사용
const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'http://api.guthub.shop:8080';

/**
 * OAuth2 인증 URL (백엔드)
 * TODO: 백엔드 도메인 확정 후 수정
 */
const OAUTH_BASE_URL = API_BASE_URL;

/**
 * Axios 인스턴스 생성
 * - 기본 타임아웃 10초
 * - JSON 콘텐츠 타입
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // refreshToken을 HttpOnly 쿠키로 주고받는 플로우를 위해 필요
  withCredentials: true,
});

export const authService = {
  /**
   * ============================================================
   * OAuth2 인증 URL 생성
   * ============================================================
   *
   * [1단계] 에서 사용
   * 소셜 로그인 버튼 클릭 시 이동할 백엔드 OAuth2 URL 반환
   *
   * @param provider - 소셜 로그인 제공자 ('google' | 'kakao' | 'naver')
   * @returns OAuth2 인증 시작 URL
   *
   * TODO: 백엔드 OAuth2 엔드포인트 경로 확인 필요
   *       - Spring Security 기본: /oauth2/authorization/{provider}
   */
  getOAuthURL(provider: SocialProvider): string {
    return `${OAUTH_BASE_URL}/oauth2/authorization/${provider}`;
  },

  /**
   * ============================================================
   * 액세스 토큰 발급 요청
   * ============================================================
   *
   * [3단계 → 4단계] 에서 사용
   * OAuth2 인증 성공 후, refreshToken으로 accessToken 발급받기
   *
   * @param refreshToken - 백엔드에서 발급받은 리프레시 토큰
   * @returns accessToken이 담긴 응답
   *
   * TODO: 백엔드 /jwt/refresh API 스펙 확정 필요
   *       - 요청: refreshToken을 body에 담을지, 쿠키로 보낼지
   *       - 응답: { accessToken: string } 형태 확인
   */
  async getAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Body에 refreshToken 담아서 전송
      const response = await apiClient.post<ApiEnvelope<{ accessToken: string }>>(
        '/jwt/refresh',
        { refreshToken }
      );
      if (response.data.code !== 'SUCCESS') {
        throw new Error(response.data.message || '토큰 발급에 실패했습니다.');
      }
      return { accessToken: response.data.data.accessToken };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '토큰 발급에 실패했습니다.');
      }
      throw error;
    }
  },

  /**
   * ============================================================
   * 이메일 로그인 (일반 로그인)
   * ============================================================
   *
   * TODO: 이메일 로그인 기능 필요 시 구현
   *       현재는 소셜 로그인만 지원 예정
   */
  async emailLogin(credentials: EmailLoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
      }
      throw error;
    }
  },

  /**
   * ============================================================
   * 회원가입
   * ============================================================
   *
   * Body: { username, password, nickname, email }
   * Response: {
   *   code: 'SUCCESS',
   *   message: '요청이 성공하였습니다.',
   *   data: { userEntityId: '123456789abcd' }
   * }
   */
  async signup(payload: SignupRequest): Promise<SignupResponseData> {
    try {
      const res = await apiClient.post<ApiEnvelope<SignupResponseData>>('/auth/signup', payload);
      if (res.data.code !== 'SUCCESS') {
        throw new Error(res.data.message || '회원가입에 실패했습니다.');
      }
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = (error.response?.data as any)?.code;
        const message = (error.response?.data as any)?.message;
        // 백엔드 상태/코드 별 메시지 매핑 유지
        if (code === 'INVALID_INPUT') {
          throw new Error(message || '입력 값이 올바르지 않습니다.');
        }
        if (code === 'DUPLICATE_USERNAME') {
          throw new Error(message || '이미 존재하는 아이디입니다.');
        }
        if (code === 'DUPLICATE_EMAIL') {
          throw new Error(message || '이미 가입된 이메일입니다.');
        }
        throw new Error(message || '회원가입 요청에 실패했습니다.');
      }
      throw error;
    }
  },

  /**
   * ============================================================
   * 토큰 갱신 (리프레시)
   * ============================================================
   *
   * accessToken 만료 시 refreshToken으로 새 accessToken 발급
   *
   * TODO: 토큰 갱신 로직 구현
   *       - 401 에러 발생 시 자동 갱신 인터셉터 추가 고려
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Body에 refreshToken 담아서 전송하여 새 accessToken 발급
      const response = await apiClient.post<ApiEnvelope<{ accessToken: string }>>(
        '/jwt/refresh',
        { refreshToken }
      );
      if (response.data.code !== 'SUCCESS') {
        throw new Error(response.data.message || '토큰 갱신에 실패했습니다.');
      }
      return { accessToken: response.data.data.accessToken };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '토큰 갱신에 실패했습니다.');
      }
      throw error;
    }
  },

  /**
   * ============================================================
   * 로그아웃
   * ============================================================
   *
   * TODO: 백엔드 로그아웃 API 구현 후 연동
   *       - refreshToken을 DB에서 삭제하는 API 호출
   *       - 로컬 SecureStore의 토큰도 삭제
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      // TODO: 백엔드 로그아웃 엔드포인트 확정 필요
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * ============================================================
   * 사용자 정보 조회
   * ============================================================
   *
   * 현재 로그인한 사용자의 프로필 정보 조회
   * accessToken이 필요한 보호된 엔드포인트
   *
   * GET /user/me
   * Response: {
   *   code: 'SUCCESS',
   *   message: '내 정보 조회 성공',
   *   data: {
   *     username: 'testuser',
   *     email: 'test@guthub.com',
   *     nickname: '테스트유저',
   *     social: false,
   *     gutType?: 'type1',
   *     imageUrl?: 'https://...'
   *   }
   * }
   *
   * @returns 현재 사용자 정보
   * @throws Error - USER_NOT_FOUND: 토큰은 유효하지만 DB에 유저 없음
   */
  async getUserProfile(): Promise<UserProfileResponseData> {
    try {
      const response = await apiClient.get<ApiEnvelope<UserProfileResponseData>>('/user/me');
      
      if (response.data.code !== 'SUCCESS') {
        if (response.data.code === 'USER_NOT_FOUND') {
          throw new Error(response.data.message || '사용자를 찾을 수 없습니다.');
        }
        throw new Error(response.data.message || '사용자 정보 조회에 실패했습니다.');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = (error.response?.data as any)?.code;
        const message = (error.response?.data as any)?.message;
        
        if (code === 'USER_NOT_FOUND') {
          throw new Error(message || '사용자를 찾을 수 없습니다.');
        }
        
        throw new Error(message || '사용자 정보 조회에 실패했습니다.');
      }
      throw error;
    }
  },

  // ============================================================
  // 🧪 Mock 함수들 (개발/테스트용)
  // TODO: 백엔드 완성 후 제거
  // ============================================================

  /**
   * [Mock] 이메일 로그인 테스트용
   */
  mockEmailLogin(credentials: EmailLoginRequest): LoginResponse {
    console.log('🧪 [Mock] 이메일 로그인:', credentials.email);
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: {
        id: 'mock_user_id',
        email: credentials.email,
        name: 'Test User',
      },
    };
  },

  /**
   * [Mock] 소셜 로그인 테스트용
   * 실제로는 OAuth2 플로우를 거쳐야 함
   */
  mockSocialLogin(provider: SocialProvider): LoginResponse {
    console.log(`🧪 [Mock] ${provider} 소셜 로그인`);
    return {
      accessToken: 'mock_social_access_token_' + Date.now(),
      refreshToken: 'mock_social_refresh_token_' + Date.now(),
      user: {
        id: 'mock_social_user_id',
        email: `user@${provider}.com`,
        name: `${provider} User`,
      },
    };
  },
};
