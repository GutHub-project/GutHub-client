import EncryptedStorage from 'react-native-encrypted-storage';

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error('[Storage] getItem failed:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error('[Storage] setItem failed:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] removeItem failed:', error);
    }
  },
};
