import axios, { AxiosInstance } from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

// 기본값
const DEFAULT_BASE_URL = 'http://api.guthub.shop:8080';
const DEFAULT_WEB_URL = 'https://guthub.shop';

// 환경변수 가져오기 - Next.js에서는 NEXT_PUBLIC_ 접두사 필수
const getBaseUrl = (): string => {
  // 프로덕션 웹 브라우저 환경에서는 프록시 사용 (Mixed Content 방지)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('[getBaseUrl] Production browser, using /api proxy');
    return '/api';
  }

  // Next.js 환경변수 (브라우저에서도 접근 가능)
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    console.log('[getBaseUrl] Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Node.js 환경변수
  if (typeof process !== 'undefined' && process.env?.BASE_URL) {
    console.log('[getBaseUrl] Using BASE_URL:', process.env.BASE_URL);
    return process.env.BASE_URL;
  }
  // Vite 환경변수
  if (typeof process !== 'undefined' && process.env?.VITE_BASE_URL) {
    console.log('[getBaseUrl] Using VITE_BASE_URL:', process.env.VITE_BASE_URL);
    return process.env.VITE_BASE_URL;
  }

  console.log('[getBaseUrl] Using DEFAULT_BASE_URL:', DEFAULT_BASE_URL);
  return DEFAULT_BASE_URL;
};

const getWebUrl = (): string => {
  // Next.js 환경변수 (브라우저에서도 접근 가능)
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WEB_URL) {
    return process.env.NEXT_PUBLIC_WEB_URL;
  }
  // Node.js 환경변수
  if (typeof process !== 'undefined' && process.env?.WEB_URL) {
    return process.env.WEB_URL;
  }
  return DEFAULT_WEB_URL;
};

let BASE_URL: string = getBaseUrl();
let WEB_URL: string = getWebUrl();

// 2. React Native에서 react-native-dotenv를 사용하는 경우 @env 모듈 확인
try {
  // @ts-ignore
  const env = require('@env');
  console.log('[API Instance] @env module loaded:', env);
  if (env) {
    if (env.BASE_URL) {
      console.log('[API Instance] Setting BASE_URL from @env:', env.BASE_URL);
      BASE_URL = env.BASE_URL;
    }
    if (env.WEB_URL) {
      console.log('[API Instance] Setting WEB_URL from @env:', env.WEB_URL);
      WEB_URL = env.WEB_URL;
    }
  }
} catch (e) {
  console.log('[API Instance] @env module not found, using defaults');
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
  console.log('[createAxiosInstance] Creating instance with baseURL:', baseURL);
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

// Lazy initialization to ensure BASE_URL is properly set
let _publicApiInstance: AxiosInstance | null = null;
let _privateApiInstance: AxiosInstance | null = null;
let _formDataApiInstance: AxiosInstance | null = null;

export const publicApiInstance = new Proxy({} as AxiosInstance, {
  get(target, prop) {
    if (!_publicApiInstance) {
      console.log('[publicApiInstance] Lazy initializing with BASE_URL:', BASE_URL);
      _publicApiInstance = createApiInstance(
        BASE_URL,
        { 'Content-Type': 'application/json' },
        { useResponseInterceptors: true },
      );
    }
    return (_publicApiInstance as any)[prop];
  },
});

export const privateApiInstance = new Proxy({} as AxiosInstance, {
  get(target, prop) {
    if (!_privateApiInstance) {
      console.log('[privateApiInstance] Lazy initializing with BASE_URL:', BASE_URL);
      _privateApiInstance = createApiInstance(
        BASE_URL,
        { 'Content-Type': 'application/json' },
        { useRequestInterceptors: true, useResponseInterceptors: true },
      );
    }
    return (_privateApiInstance as any)[prop];
  },
});

export const formDataApiInstance = new Proxy({} as AxiosInstance, {
  get(target, prop) {
    if (!_formDataApiInstance) {
      console.log('[formDataApiInstance] Lazy initializing with BASE_URL:', BASE_URL);
      _formDataApiInstance = createApiInstance(
        BASE_URL,
        { 'Content-Type': 'multipart/form-data' },
        { useRequestInterceptors: true, useResponseInterceptors: true },
      );
    }
    return (_formDataApiInstance as any)[prop];
  },
});

// BASE_URL과 WEB_URL을 export하여 다른 곳에서 사용 가능하도록 함
export { BASE_URL, WEB_URL };