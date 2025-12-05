/**
 * ============================================================
 * 인증 관련 타입 정의
 * ============================================================
 * 
 * OAuth2 소셜 로그인 플로우:
 * 1단계: 사용자가 소셜 로그인 버튼 클릭
 * 2단계: 백엔드 /oauth2/authorization/{provider}로 리디렉션
 * 3단계: 백엔드가 소셜 인증 후 refreshToken을 쿠키로 전달하며 리디렉션
 * 4단계: 프론트엔드가 /jwt/refresh API 호출하여 accessToken 발급받음
 * ============================================================
 */

/** 로그인 타입 - 이메일 또는 소셜 */
export type LoginType = 'email' | 'social';

/** 지원하는 소셜 로그인 제공자 */
export type SocialProvider = 'google' | 'kakao' | 'naver';

/**
 * 인증 토큰 인터페이스
 * - accessToken: API 요청 시 Authorization 헤더에 포함 (Bearer 토큰)
 * - refreshToken: accessToken 만료 시 재발급용 (SecureStore에 저장)
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 전역 인증 상태 인터페이스
 * Zustand store에서 관리
 */
export interface AuthState {
  tokens: AuthTokens | null;
  loginType: LoginType | null;
  socialProvider?: SocialProvider;
  isAuthenticated: boolean;
}

/** 이메일 로그인 요청 DTO */
export interface EmailLoginRequest {
  email: string;
  password: string;
}

/**
 * 소셜 로그인 요청 DTO
 * TODO: 백엔드 API 스펙 확정 후 필드 조정 필요
 */
export interface SocialLoginRequest {
  provider: SocialProvider;
  accessToken: string;
}

/**
 * 로그인 응답 DTO
 * TODO: 백엔드 응답 스펙 확정 후 필드 조정 필요
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * OAuth2 리디렉션 후 받는 응답 타입
 * TODO: 백엔드 SocialSuccessHandler 응답 스펙에 맞게 수정
 */
export interface OAuthCallbackResponse {
  refreshToken: string; // HttpOnly 쿠키로 전달됨
}

/**
 * /jwt/refresh API 응답 타입
 * refreshToken으로 accessToken을 발급받을 때 사용
 */
export interface RefreshTokenResponse {
  accessToken: string;
}
