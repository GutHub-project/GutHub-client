import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'accessToken';

export const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage.getItem(key);
        }
        return null;
      },
      setItem: async (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, value);
        }
      },
      removeItem: async (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(key);
        }
      },
    };
  }

  try {
    // Native 환경에서만 동적 임포트
    const EncryptedStorage = require('react-native-encrypted-storage').default;
    return {
      getItem: async (key: string) => EncryptedStorage.getItem(key),
      setItem: async (key: string, value: string) => EncryptedStorage.setItem(key, value),
      removeItem: async (key: string) => EncryptedStorage.removeItem(key),
    };
  } catch (error) {
    console.warn('[Storage] EncryptedStorage not available, falling back to memory storage');
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: async (key: string) => memoryStorage[key] || null,
      setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: async (key: string) => { delete memoryStorage[key]; },
    };
  }
};

const storageInstance = getStorage();

export const storage = {
  getAccessToken: () => storageInstance.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => storageInstance.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => storageInstance.removeItem(ACCESS_TOKEN_KEY),
};
