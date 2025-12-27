import axios, { AxiosInstance } from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

// .env.production의 BASE_URL 또는 환경변수 사용
// 우선순위: BASE_URL (네이티브/Node.js) > NEXT_PUBLIC_API_URL (Next.js) > VITE_BASE_URL (Vite) > 기본값
let BASE_URL: string = 'http://api.guthub.shop:8080'; // 기본값을 실제 백엔드 주소로 설정
let WEB_URL: string = 'https://guthub.shop'; // 기본값을 실제 웹 주소로 설정

// 1. 빌드 타임에 환경변수 체크 (Web/Node.js)
if (typeof process !== 'undefined' && process.env) {
  const envUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_API_URL || process.env.VITE_BASE_URL;
  if (envUrl) {
    BASE_URL = envUrl;
  }
  const webUrl = process.env.WEB_URL || process.env.NEXT_PUBLIC_WEB_URL;
  if (webUrl) {
    WEB_URL = webUrl;
  }
}

// 2. React Native에서 react-native-dotenv를 사용하는 경우 @env 모듈 확인
try {
  // @ts-ignore
  const env = require('@env');
  if (env) {
    if (env.BASE_URL) BASE_URL = env.BASE_URL;
    if (env.WEB_URL) WEB_URL = env.WEB_URL;
  }
} catch (e) {
  // @env 모듈이 없는 경우 무시
}

// 3. URL 형식 검증 (슬래시 중복 방지 등)
if (BASE_URL.endsWith('/')) {
  BASE_URL = BASE_URL.slice(0, -1);
}
if (WEB_URL.endsWith('/')) {
  WEB_URL = WEB_URL.slice(0, -1);
}

console.log('[API Instance] Final BASE_URL:', BASE_URL);
console.log('[API Instance] Final WEB_URL:', WEB_URL);

const createAxiosInstance = (baseURL: string, headers: { [key: string]: string }): AxiosInstance => {
  return axios.create({
    baseURL,
    headers: {
      ...headers,
    },
  });
};

const configureRequestInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(requestInterceptor);
};

const configureResponseInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(successInterceptor, errorInterceptor);
};

const createApiInstance = (
  baseURL: string,
  headers: { [key: string]: string },
  options: {
    useRequestInterceptors?: boolean;
    useResponseInterceptors?: boolean;
  } = { useRequestInterceptors: false, useResponseInterceptors: false },
): AxiosInstance => {
  const instance = createAxiosInstance(baseURL, headers);

  if (options.useRequestInterceptors) {
    configureRequestInterceptors(instance);
  }

  if (options.useResponseInterceptors) {
    configureResponseInterceptors(instance);
  }

  return instance;
};

export const publicApiInstance = createApiInstance(
  BASE_URL as string,
  {
    'Content-Type': 'application/json',
  },
  { useResponseInterceptors: true },
);

export const privateApiInstance = createApiInstance(
  BASE_URL as string,
  {
    'Content-Type': 'application/json',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);

export const formDataApiInstance = createApiInstance(
  BASE_URL as string,
  {
    'Content-Type': 'multipart/form-data',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);

// BASE_URL과 WEB_URL을 export하여 다른 곳에서 사용 가능하도록 함
export { BASE_URL, WEB_URL };