import { create } from 'zustand';
import { Platform } from 'react-native';
import { storage } from '../utils/storage';
import type { AuthStore, UserProfile } from '../types';

const isNative = Platform.OS !== 'web';

/**
 * 인증 상태 관리를 위한 Zustand Store
 *
 * - 웹: Refresh Token은 HttpOnly 쿠키로 관리
 * - 네이티브: Refresh Token은 EncryptedStorage에 저장 (앱 재시작 시 자동 로그인)
 * - Access Token은 메모리(Zustand)에만 보관
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
    if (isNative) {
      try {
        await storage.removeItem('refreshToken');
      } catch (error) {
        console.error('[AuthStore] Failed to remove refreshToken:', error);
      }
    }
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // 액션: 로그인
  login: async (response: { accessToken: string; refreshToken?: string; userId?: string; email?: string; name?: string; profileImage?: string }) => {
    const { accessToken, refreshToken, userId, email, name, profileImage } = response;

    // 네이티브에서만 Refresh Token 저장 (자동 로그인용)
    if (isNative && refreshToken) {
      try {
        await storage.setItem('refreshToken', refreshToken);
      } catch (error) {
        console.error('[AuthStore] Failed to save refreshToken:', error);
      }
    }

    set({
      accessToken,
      user: name ? {
        nickname: name,
        ageRange: 0, // TODO: 응답에서 받아오도록 수정
        gender: '', // TODO: 응답에서 받아오도록 수정
        gutType: {
          code: '',
          name: '',
          description: '',
          imageUrl: '',
        }, // TODO: 응답에서 받아오도록 수정
      } : null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // 액션: 로그아웃
  logout: async () => {
    if (isNative) {
      try {
        await storage.removeItem('refreshToken');
      } catch (error) {
        console.error('[AuthStore] Failed to remove refreshToken:', error);
      }
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
  if (!isNative) return;

  try {
    const refreshToken = await storage.getItem('refreshToken');
    if (refreshToken) {
      // Refresh Token으로 Access Token 갱신
      const { authApi } = await import('../apis/auth');

      try {
        const response = await authApi.refreshToken(refreshToken);
        await useAuthStore.getState().setAccessToken(response.accessToken);
        
        // 유저 정보도 불러오기
        try {
          const { userApi } = await import('../apis/user');
          const userInfo = await userApi.getProfile();
          useAuthStore.getState().setUser({
            nickname: userInfo.nickname || '',
            ageRange: userInfo.ageRange || 0,
            gender: userInfo.gender || '',
            gutType: userInfo.gutType || {
              code: '',
              name: '',
              description: '',
              imageUrl: '',
            },
          });
          console.log('[initializeAuth] 유저 정보 불러오기 성공');
        } catch (error) {
          console.error('[initializeAuth] 유저 정보 불러오기 실패:', error);
          // 유저 정보 불러오기 실패해도 계속 진행
        }
      } catch (error) {
        console.error('[AuthStore] Token refresh failed:', error);
        // Refresh Token이 만료되었으면 삭제
        await storage.removeItem('refreshToken');
      }
    }
  } catch (error) {
    console.error('[AuthStore] Failed to initialize auth:', error);
  }
};

// 액세스 토큰 가져오기 헬퍼 함수
export const getAccessToken = () => useAuthStore.getState().accessToken;

// Refresh Token 가져오기 헬퍼 함수 (네이티브 전용)
export const getRefreshToken = async () => {
  if (!isNative) return null;
  return storage.getItem('refreshToken');
};

// 토큰 상태 확인 디버깅 함수
export const checkTokenStatus = async (verifyWithApi: boolean = false) => {
  const state = useAuthStore.getState();
  const accessToken = state.accessToken;
  const refreshToken = isNative ? await storage.getItem('refreshToken') : '쿠키에 저장됨 (웹)';
  
  console.log('=== 토큰 상태 확인 ===');
  console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : '없음');
  console.log('Refresh Token:', refreshToken ? (typeof refreshToken === 'string' ? `${refreshToken.substring(0, 20)}...` : '있음') : '없음');
  console.log('인증 상태:', state.isAuthenticated);
  console.log('사용자 정보:', state.user);
  
  // 실제 API 호출로 토큰 유효성 검증
  let tokenValid = false;
  let apiError: any = null;
  let userInfoFromApi: any = null;
  
  if (verifyWithApi && accessToken) {
    try {
      console.log('🔄 API로 토큰 유효성 검증 중...');
      const { userApi } = await import('../apis/user');
      userInfoFromApi = await userApi.getMyInfo();
      tokenValid = true;
      console.log('✅ 토큰이 유효합니다! API 응답:', userInfoFromApi);
    } catch (error: any) {
      tokenValid = false;
      apiError = error;
      const status = error?.response?.status;
      const errorCode = error?.response?.data?.errorCode;
      
      if (status === 401) {
        console.error('❌ 토큰이 만료되었거나 유효하지 않습니다.');
        if (errorCode === 'TOKEN_EXPIRED') {
          console.error('   → TOKEN_EXPIRED: 토큰 만료');
        } else if (errorCode === 'TOKEN_INVALID') {
          console.error('   → TOKEN_INVALID: 토큰이 유효하지 않음');
        } else if (errorCode === 'UNAUTHORIZED_USER') {
          console.error('   → UNAUTHORIZED_USER: 인증되지 않은 사용자');
        }
      } else {
        console.error('❌ API 호출 실패:', error.message);
      }
    }
  }
  
  console.log('==================');
  
  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    tokenValid: verifyWithApi ? tokenValid : undefined,
    apiError: verifyWithApi ? apiError : undefined,
    userInfoFromApi: verifyWithApi ? userInfoFromApi : undefined,
  };
};
