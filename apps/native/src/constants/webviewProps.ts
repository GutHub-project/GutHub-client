import { WEB_URL as ENV_WEB_URL } from '@env';

const BOTTOM_BAR_HEIGHT = 70;

// 환경변수가 없으면 프로덕션 웹 URL을 기본값으로 사용
const BASE_URL = ENV_WEB_URL || 'https://guthub.shop';

export const WEBVIEW_PROPS = {
  BOTTOM_BAR_HEIGHT,
  BASE_URL,
};
