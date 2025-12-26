import axios, { AxiosInstance } from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

// .env.production의 BASE_URL 또는 환경변수 사용
// 우선순위: BASE_URL (네이티브/Node.js) > NEXT_PUBLIC_API_URL (Next.js) > VITE_BASE_URL (Vite) > 기본값
// React Native에서는 react-native-dotenv를 통해 빌드 타임에 process.env.BASE_URL이 주입됨
let BASE_URL;

// 빌드 타임에 환경변수 체크
if (typeof process !== 'undefined' && process.env) {
  BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_API_URL || process.env.VITE_BASE_URL || BASE_URL;
}

console.log('[API Instance] Using BASE_URL:', BASE_URL);

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
  BASE_URL,
  {
    'Content-Type': 'application/json',
  },
  { useResponseInterceptors: true },
);

export const privateApiInstance = createApiInstance(
  BASE_URL,
  {
    'Content-Type': 'application/json',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);

export const formDataApiInstance = createApiInstance(
  BASE_URL,
  {
    'Content-Type': 'multipart/form-data',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);

// BASE_URL을 export하여 다른 곳에서 사용 가능하도록 함
export { BASE_URL };