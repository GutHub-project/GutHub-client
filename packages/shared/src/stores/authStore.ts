import { create } from 'zustand';
import { Platform } from 'react-native';
import { storage } from '../utils/storage';
import type { AuthStore, UserProfile } from '../types';

const isNative = Platform.OS !== 'web';

/**
 * 인증 상태 관리를 위한 Zustand Store
 *
 * - 웹/네이티브 모두: Refresh Token은 HttpOnly 쿠키로 관리 (WebView 내부에서)
 * - Access Token은 메모리(Zustand)에만 보관
 * - 네이티브는 WebView로 웹을 띄우므로 쿠키는 WebView가 관리
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

  // 액션: 액세스 토큰 설정 (메모리에만 저장)
  setAccessToken: async (accessToken: string) => {
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
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // 액션: 로그인 (Access Token만 메모리에 저장, Refresh Token은 쿠키로 자동 관리)
  login: async (response: { accessToken: string; userId?: string; email?: string; name?: string; profileImage?: string }) => {
    const { accessToken, userId, email, name, profileImage } = response;

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

  // 액션: 로그아웃 (상태 초기화만, 쿠키는 서버 API에서 삭제)
  logout: async () => {
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

// 초기 토큰 로드 함수 (웹에서만 실행, 네이티브는 WebView가 알아서 처리)
export const initializeAuth = async () => {
  // 네이티브는 WebView 안에서 쿠키로 관리되므로 별도 초기화 불필요
  if (isNative) return;

  // 웹에서는 쿠키가 자동으로 전송되므로 별도 초기화 불필요
  // 필요시 여기에 초기 사용자 정보 로드 로직 추가
};

// 액세스 토큰 가져오기 헬퍼 함수
export const getAccessToken = () => useAuthStore.getState().accessToken;
