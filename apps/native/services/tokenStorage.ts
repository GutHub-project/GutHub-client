import * as SecureStore from 'expo-secure-store';

import { AuthTokens, LoginType, SocialProvider } from '../types/auth';

const TOKEN_KEY = 'auth_tokens';
const LOGIN_TYPE_KEY = 'login_type';
const SOCIAL_PROVIDER_KEY = 'social_provider';

export const tokenStorage = {
  async saveTokens(tokens: AuthTokens, loginType: LoginType, socialProvider?: SocialProvider): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
      await SecureStore.setItemAsync(LOGIN_TYPE_KEY, loginType);

      if (socialProvider) {
        await SecureStore.setItemAsync(SOCIAL_PROVIDER_KEY, socialProvider);
      } else {
        await SecureStore.deleteItemAsync(SOCIAL_PROVIDER_KEY);
      }
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw error;
    }
  },

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensStr = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokensStr ? JSON.parse(tokensStr) : null;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  },

  async getLoginType(): Promise<LoginType | null> {
    try {
      const loginType = await SecureStore.getItemAsync(LOGIN_TYPE_KEY);
      return loginType as LoginType | null;
    } catch (error) {
      console.error('Failed to get login type:', error);
      return null;
    }
  },

  async getSocialProvider(): Promise<SocialProvider | null> {
    try {
      const provider = await SecureStore.getItemAsync(SOCIAL_PROVIDER_KEY);
      return provider as SocialProvider | null;
    } catch (error) {
      console.error('Failed to get social provider:', error);
      return null;
    }
  },

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

  async hasTokens(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null;
  },
};
