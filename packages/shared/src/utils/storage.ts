import { Platform } from 'react-native';

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

  // Memory storage as fallback
  const memoryStorage: Record<string, string> = {};
  const memoryStorageImplementation = {
    getItem: async (key: string) => {
      console.log('[Storage] Memory getItem:', key, '→', memoryStorage[key] || null);
      return memoryStorage[key] || null;
    },
    setItem: async (key: string, value: string) => {
      console.log('[Storage] Memory setItem:', key);
      memoryStorage[key] = value;
    },
    removeItem: async (key: string) => {
      console.log('[Storage] Memory removeItem:', key);
      delete memoryStorage[key];
    },
  };

  try {
    // Native 환경에서만 동적 임포트
    const EncryptedStorage = require('react-native-encrypted-storage').default;
    console.log('[Storage] EncryptedStorage loaded successfully');

    return {
      getItem: async (key: string) => {
        try {
          const value = await EncryptedStorage.getItem(key);
          console.log('[Storage] EncryptedStorage getItem:', key, '→', value);
          return value;
        } catch (error) {
          console.error('[Storage] EncryptedStorage getItem failed:', error);
          // Fallback to memory storage
          return memoryStorageImplementation.getItem(key);
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await EncryptedStorage.setItem(key, value);
          console.log('[Storage] EncryptedStorage setItem:', key);
        } catch (error) {
          console.error('[Storage] EncryptedStorage setItem failed:', error);
          // Fallback to memory storage
          return memoryStorageImplementation.setItem(key, value);
        }
      },
      removeItem: async (key: string) => {
        try {
          await EncryptedStorage.removeItem(key);
          console.log('[Storage] EncryptedStorage removeItem:', key);
        } catch (error) {
          console.error('[Storage] EncryptedStorage removeItem failed:', error);
          // Fallback to memory storage
          return memoryStorageImplementation.removeItem(key);
        }
      },
    };
  } catch (error) {
    console.warn('[Storage] EncryptedStorage not available, using memory storage');
    return memoryStorageImplementation;
  }
};

const storageInstance = getStorage();

// 범용 storage (필요시 다른 데이터 저장용)
export const storage = {
  getItem: (key: string) => storageInstance.getItem(key),
  setItem: (key: string, value: string) => storageInstance.setItem(key, value),
  removeItem: (key: string) => storageInstance.removeItem(key),
};
