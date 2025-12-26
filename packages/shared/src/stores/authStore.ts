import { create } from 'zustand';
import { Platform } from 'react-native';
import { storage } from '../utils/storage';
import type { AuthStore, UserProfile } from '../types';

const isNative = Platform.OS !== 'web';

/**
 * 인증 상태 관리를 위한 Zustand Store
 *
 * 리프레시 토큰은 쿠키로 관리되므로 액세스 토큰만 저장합니다.
 *
 * 사용 예시:
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useAuthStore();
 * ```
 */
export const useAuthStore = create<AuthStore>((set) => ({
  // 초기 상태
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // 액션: 액세스 토큰 설정
  setAccessToken: async (accessToken: string) => {
    try {
      await storage.setAccessToken(accessToken);
    } catch (error) {
      console.error('[AuthStore] Failed to save accessToken:', error);
    }
    set({
      accessToken,
      isAuthenticated: true,
    });
  },

  // 액션: 사용자 정보 설정
  setUser: (user: UserProfile) => {
    set({ user });
  },

  // 액션: 인증 정보 초기화
  clearAuth: async () => {
    try {
      await storage.removeAccessToken();
    } catch (error) {
      console.error('[AuthStore] Failed to remove accessToken:', error);
    }
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // 액션: 로그인 (액세스 토큰 + 사용자 정보 저장)
  login: async (response: { accessToken: string; userId?: string; email?: string; name?: string; profileImage?: string }) => {
    const { accessToken, userId, email, name, profileImage } = response;

    try {
      await storage.setAccessToken(accessToken);
    } catch (error) {
      console.error('[AuthStore] Failed to save accessToken:', error);
    }

    set({
      accessToken,
      user: name ? {
        nickname: name,
        ageRange: '', // TODO: 응답에서 받아오도록 수정
        gender: '', // TODO: 응답에서 받아오도록 수정
        gutType: '', // TODO: 응답에서 받아오도록 수정
      } : null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // 액션: 로그아웃 (상태 초기화)
  logout: async () => {
    try {
      await storage.removeAccessToken();
    } catch (error) {
      console.error('[AuthStore] Failed to remove accessToken:', error);
    }
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // 액션: 로딩 상태 설정
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));

// 초기 토큰 로드 함수
export const initializeAuth = async () => {
  try {
    const accessToken = await storage.getAccessToken();
    if (accessToken) {
      useAuthStore.getState().setAccessToken(accessToken);
    }
  } catch (error) {
    console.error('[AuthStore] Failed to load accessToken:', error);
  }
};

// 액세스 토큰 가져오기 헬퍼 함수
export const getAccessToken = () => useAuthStore.getState().accessToken;
