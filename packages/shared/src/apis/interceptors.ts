import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, useAuthStore } from '../stores';

// access token 헤더에 추가
export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {

  if (!config?.headers) {
    return config;
  }

  // Zustand store에서 access token 가져오기
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

interface ErrorResponse {
  code: string;
  message: string;
}

// refresh token 재요청 로직 필요
export const errorInterceptor = async (error: AxiosError<ErrorResponse>): Promise<any> => {
  const { config } = error;

  if (!config) {
    throw new Error('요청이 잘못되었습니다.');
  }

  const handleLogout = async (message: string) => {
    const { logout } = useAuthStore.getState();
    await logout();
    return Promise.reject(new ApiError(401, message));
  };

  if (error.response?.status === 500) {
    console.error('500 Internal Server Error');
    return Promise.reject(new ApiError(500, '', error.response?.data));
  }

  if (error.response?.status === 404) {
    console.error(`404 Not Found`);
    return Promise.reject(new ApiError(404, '', error.response.data));
  }

  // 백엔드 설계에 따라 Access Token 만료 시 400 에러 반환
  if (error.response?.status === 400) {
    const isRefreshRequest = config.url?.includes('/auth/refresh');

    if (isRefreshRequest) {
      return handleLogout('세션이 만료되었습니다. 다시 로그인해주세요.');
    }

    try {
      // /auth/refresh API 호출 (withCredentials: true로 쿠키의 Refresh Token 전송)
      // 순환 참조 방지를 위해 axios 직접 사용
      const baseURL = config.baseURL || '';
      const refreshUrl = baseURL.endsWith('/') ? 'auth/refresh' : '/auth/refresh';
      
      const response = await axios.get(`${baseURL}${refreshUrl}`, {
        withCredentials: true,
      });
      const newAccessToken = response.data.accessToken;

      // 새 토큰 저장
      await useAuthStore.getState().setAccessToken(newAccessToken);

      // 이전 요청 재시도
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(config);
    } catch (refreshError) {
      return handleLogout('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  if (error.response?.status === 403) {
    return handleLogout('권한이 없습니다. 로그인 페이지로 이동합니다.');
  }

  if (error.response) {
    const { status, data } = error.response;
    const apiError = new ApiError(status, data?.message || '서버 처리 중 오류가 발생했습니다.', data);
    return Promise.reject(apiError);
  } else if (error.request) {
    const apiError = new ApiError(0, '요청은 완료했으나, 서버로부터 응답을 받지 못했습니다.', error.request);
    return Promise.reject(apiError);
  } else {
    const apiError = new ApiError(0, '서버로부터 응답이 없습니다.', error.message);
    return Promise.reject(apiError);
  }
};