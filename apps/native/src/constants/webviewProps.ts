import Constants from 'expo-constants';

const BOTTOM_BAR_HEIGHT = 70;
const BASE_URL = Constants.expoConfig?.extra?.baseUrl ?? '';

export const WEBVIEW_PROPS = {
  BOTTOM_BAR_HEIGHT,
  BASE_URL,
};
