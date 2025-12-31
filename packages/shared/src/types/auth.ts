// 소셜 로그인 제공자 타입
export type SocialProvider = 'google' | 'kakao' | 'naver';

// 소셜 로그인 응답 타입
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // 네이티브에서만 사용
  userId?: string;
  email?: string;
  name?: string;
  profileImage?: string;
}

// 토큰 갱신 요청 타입 (리프레시 토큰은 쿠키에서 자동으로 전송)
export interface RefreshTokenRequest {
  // 쿠키로 전송되므로 body는 비어있음
}

// 토큰 갱신 응답 타입 (리프레시 토큰은 쿠키로 관리)
export interface RefreshTokenResponse {
  accessToken: string;
}

// 사용자 정보 타입
export interface UserProfile {
  nickname: string;
  ageRange: string;
  gender: string;
  gutType: string;
}

// Auth Store 상태 타입 (리프레시 토큰은 쿠키로 관리하므로 제거)
export interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth Store 액션 타입
export interface AuthActions {
  setAccessToken: (accessToken: string) => void | Promise<void>;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void | Promise<void>;
  login: (response: AuthResponse) => void | Promise<void>;
  logout: () => void | Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

// 전체 Auth Store 타입
export type AuthStore = AuthState & AuthActions;
