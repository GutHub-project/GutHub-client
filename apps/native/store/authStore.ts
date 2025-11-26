import { create } from 'zustand';

import { tokenStorage } from '../services/tokenStorage';
import { AuthState, AuthTokens, LoginType, SocialProvider } from '../types/auth';

interface AuthStore extends AuthState {
  setAuth: (tokens: AuthTokens, loginType: LoginType, socialProvider?: SocialProvider) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
  updateAccessToken: (accessToken: string) => Promise<void>;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  tokens: null,
  loginType: null,
  socialProvider: undefined,
  isAuthenticated: false,

  setAuth: async (tokens, loginType, socialProvider) => {
    await tokenStorage.saveTokens(tokens, loginType, socialProvider);
    set({
      tokens,
      loginType,
      socialProvider,
      isAuthenticated: true,
    });
  },

  clearAuth: async () => {
    await tokenStorage.clearTokens();
    set({
      tokens: null,
      loginType: null,
      socialProvider: undefined,
      isAuthenticated: false,
    });
  },

  loadAuth: async () => {
    const tokens = await tokenStorage.getTokens();
    const loginType = await tokenStorage.getLoginType();
    const socialProvider = await tokenStorage.getSocialProvider();

    if (tokens && loginType) {
      set({
        tokens,
        loginType,
        socialProvider: socialProvider || undefined,
        isAuthenticated: true,
      });
    }
  },

  updateAccessToken: async (accessToken) => {
    const { tokens } = get();
    if (tokens) {
      const newTokens = { ...tokens, accessToken };
      await tokenStorage.updateAccessToken(accessToken);
      set({ tokens: newTokens });
    }
  },

  getAccessToken: () => {
    const { tokens } = get();
    return tokens?.accessToken || null;
  },
}));
