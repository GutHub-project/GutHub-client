import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'http://api.guthub.shop:8080';

// Access Token 관리 (메모리)
let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  console.log('[API Instance] Access Token 저장됨');
};

export const getAccessToken = () => {
  return accessToken;
};

// Public API (인증 불필요)
export const publicApiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Access Token을 헤더에 추가하는 interceptor
const requestInterceptor = (config: any) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Private API (인증 필요)
export const privateApiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Private API에 request interceptor 추가
privateApiInstance.interceptors.request.use(requestInterceptor);

export { BASE_URL };
