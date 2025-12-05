/**
 * ============================================================
 * 토큰 저장소 (tokenStorage)
 * ============================================================
 *
 * SecureStore를 사용하여 인증 토큰을 안전하게 저장/관리
 *
 * [저장 항목]
 * - auth_tokens: { accessToken, refreshToken } (JSON 문자열)
 * - login_type: 'email' | 'social'
 * - social_provider: 'google' | 'kakao' | 'naver' (소셜 로그인 시)
 *
 * [보안]
 * - expo-secure-store는 iOS Keychain / Android Keystore 사용
 * - 웹뷰 localStorage보다 훨씬 안전함
 *
 * ============================================================
 */

import * as SecureStore from 'expo-secure-store';

import { AuthTokens, LoginType, SocialProvider } from '../types/auth';

/** SecureStore 키 상수 */
const TOKEN_KEY = 'auth_tokens';
const LOGIN_TYPE_KEY = 'login_type';
const SOCIAL_PROVIDER_KEY = 'social_provider';

export const tokenStorage = {
  /**
   * ============================================================
   * 토큰 저장
   * ============================================================
   *
   * OAuth2 로그인 성공 후 토큰 저장
   *
   * @param tokens - { accessToken, refreshToken }
   * @param loginType - 'email' | 'social'
   * @param socialProvider - 소셜 로그인 시 제공자
   */
  async saveTokens(
    tokens: AuthTokens,
    loginType: LoginType,
    socialProvider?: SocialProvider
  ): Promise<void> {
    try {
      // 토큰을 JSON 문자열로 저장
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
      await SecureStore.setItemAsync(LOGIN_TYPE_KEY, loginType);

      // 소셜 로그인 시 제공자 저장
      if (socialProvider) {
        await SecureStore.setItemAsync(SOCIAL_PROVIDER_KEY, socialProvider);
      } else {
        // 이메일 로그인 시 기존 소셜 제공자 정보 삭제
        await SecureStore.deleteItemAsync(SOCIAL_PROVIDER_KEY);
      }
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw error;
    }
  },

  /**
   * ============================================================
   * 토큰 조회
   * ============================================================
   *
   * 앱 시작 시 저장된 토큰 불러오기
   *
   * @returns AuthTokens | null
   */
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensStr = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokensStr ? JSON.parse(tokensStr) : null;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  },

  /**
   * 로그인 타입 조회
   */
  async getLoginType(): Promise<LoginType | null> {
    try {
      const loginType = await SecureStore.getItemAsync(LOGIN_TYPE_KEY);
      return loginType as LoginType | null;
    } catch (error) {
      console.error('Failed to get login type:', error);
      return null;
    }
  },

  /**
   * 소셜 제공자 조회
   */
  async getSocialProvider(): Promise<SocialProvider | null> {
    try {
      const provider = await SecureStore.getItemAsync(SOCIAL_PROVIDER_KEY);
      return provider as SocialProvider | null;
    } catch (error) {
      console.error('Failed to get social provider:', error);
      return null;
    }
  },

  /**
   * ============================================================
   * accessToken만 업데이트
   * ============================================================
   *
   * refreshToken으로 새 accessToken 발급받은 후 업데이트
   *
   * TODO: 401 에러 인터셉터에서 호출하여 자동 갱신
   *
   * @param accessToken - 새로 발급받은 accessToken
   */
  async updateAccessToken(accessToken: string): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (tokens) {
        await SecureStore.setItemAsync(
          TOKEN_KEY,
          JSON.stringify({ ...tokens, accessToken })
        );
      }
    } catch (error) {
      console.error('Failed to update access token:', error);
      throw error;
    }
  },

  /**
   * ============================================================
   * 모든 토큰 삭제
   * ============================================================
   *
   * 로그아웃 시 호출
   */
  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(LOGIN_TYPE_KEY);
      await SecureStore.deleteItemAsync(SOCIAL_PROVIDER_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw error;
    }
  },

  /**
   * 토큰 존재 여부 확인
   */
  async hasTokens(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null;
  },
};
