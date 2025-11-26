export type LoginType = 'email' | 'social';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  tokens: AuthTokens | null;
  loginType: LoginType | null;
  socialProvider?: SocialProvider;
  isAuthenticated: boolean;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface SocialLoginRequest {
  provider: SocialProvider;
  accessToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}
