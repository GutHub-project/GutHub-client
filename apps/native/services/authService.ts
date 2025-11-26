import axios from 'axios';
import Constants from 'expo-constants';

import {
  EmailLoginRequest,
  SocialLoginRequest,
  LoginResponse,
  SocialProvider,
} from '../types/auth';

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
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

  async socialLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/social-login', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '소셜 로그인에 실패했습니다.');
      }
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '토큰 갱신에 실패했습니다.');
      }
      throw error;
    }
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  mockEmailLogin(credentials: EmailLoginRequest): LoginResponse {
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

  mockSocialLogin(provider: SocialProvider): LoginResponse {
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
