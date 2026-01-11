import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';

interface AuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,

  setAccessToken: (token: string) => {
    set({
      accessToken: token,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));

/**
 * 앱 시작 시 저장된 refresh token으로 자동 로그인 시도
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    
    if (refreshToken) {
      // TODO: refresh token으로 access token 재발급 API 호출
      // const response = await authApi.refreshToken(refreshToken);
      // useAuthStore.getState().setAccessToken(response.accessToken);
      console.log('[Auth] Found stored refresh token, auto-login available');
    } else {
      console.log('[Auth] No stored refresh token');
    }
  } catch (error) {
    console.error('[Auth] Failed to initialize auth:', error);
  }
};
