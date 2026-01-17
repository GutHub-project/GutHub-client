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

  // 토큰 확인 로깅
  const url = config.url || '';
  const method = config.method?.toUpperCase() || 'GET';
  const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;

  console.log(`[Request Interceptor] ${method} ${fullUrl}`);
  console.log(`[Request Interceptor] Access Token 존재: ${accessToken ? 'YES' : 'NO'}`);
  
  if (accessToken) {
    // 토큰의 일부만 로깅 (보안)
    const tokenPreview = accessToken.length > 20 
      ? `${accessToken.substring(0, 20)}...` 
      : accessToken;
    console.log(`[Request Interceptor] Token Preview: ${tokenPreview}`);
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log(`[Request Interceptor] Authorization 헤더 설정 완료`);
  } else {
    console.warn(`[Request Interceptor] ⚠️ Access Token이 없습니다. 인증이 필요한 요청일 수 있습니다.`);
  }

  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  const url = response.config.url || '';
  const method = response.config.method?.toUpperCase() || 'GET';
  const fullUrl = response.config.baseURL ? `${response.config.baseURL}${url}` : url;
  
  console.log(`[Response Interceptor] ✅ ${method} ${fullUrl} - Status: ${response.status}`);
  console.log(`[Response Interceptor] Response Data:`, response.data);
  
  return response;
};

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

interface ErrorResponse {
  code: string;
  message: string;
  status: number;
}

// refresh token 재요청 로직 필요
export const errorInterceptor = async (error: AxiosError<ErrorResponse>): Promise<any> => {
  const { config } = error;

  if (!config) {
    throw new Error('요청이 잘못되었습니다.');
  }

  const handleLogout = async (code: string, message: string) => {
    const { logout } = useAuthStore.getState();
    await logout();
    return Promise.reject(new ApiError(401, code, message));
  };

  // 에러 응답이 있는 경우
  if (error.response) {
    const { status, data } = error.response;
    const errorCode = data?.code || 'UNKNOWN_ERROR';
    const errorMessage = data?.message || '알 수 없는 오류가 발생했습니다.';

    console.error(`[API Error] ${status} ${errorCode}: ${errorMessage}`);

    // 401 Unauthorized - 토큰 관련 에러
    if (status === 401) {
      if (errorCode === 'TOKEN_EXPIRED') {
        // Access Token 만료 - Refresh Token으로 재발급 시도
        const isRefreshRequest = config.url?.includes('/jwt/refresh');

        if (isRefreshRequest) {
          return handleLogout('TOKEN_EXPIRED', '세션이 만료되었습니다. 다시 로그인해주세요.');
        }

        try {
          const baseURL = config.baseURL || '';
          const refreshUrl = baseURL.endsWith('/') ? 'jwt/refresh' : '/jwt/refresh';

          // 네이티브에서는 저장된 refresh token 사용
          const { getRefreshToken } = await import('../stores/authStore');
          const refreshToken = await getRefreshToken();

          const response = await axios.post(`${baseURL}${refreshUrl}`,
            refreshToken ? { refreshToken } : {}, // 네이티브: body에 포함, 웹: 쿠키로 전송
            {
              withCredentials: true, // 웹의 경우 쿠키 전송
            }
          );
          const newAccessToken = response.data.accessToken;

          await useAuthStore.getState().setAccessToken(newAccessToken);

          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(config);
        } catch (refreshError) {
          return handleLogout('TOKEN_EXPIRED', '세션이 만료되었습니다. 다시 로그인해주세요.');
        }
      } else if (errorCode === 'TOKEN_INVALID') {
        return handleLogout('TOKEN_INVALID', '유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      } else if (errorCode === 'UNAUTHORIZED_USER') {
        return handleLogout('UNAUTHORIZED_USER', '인증되지 않은 사용자입니다. 로그인해주세요.');
      }
    }

    // 403 Forbidden
    if (status === 403 && errorCode === 'FORBIDDEN') {
      return handleLogout('FORBIDDEN', '접근 권한이 없습니다. 로그인 페이지로 이동합니다.');
    }

    // 404 Not Found
    if (status === 404) {
      if (errorCode === 'USER_NOT_FOUND') {
        return Promise.reject(new ApiError(404, 'USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', data));
      } else if (errorCode === 'RESOURCE_NOT_FOUND') {
        return Promise.reject(new ApiError(404, 'RESOURCE_NOT_FOUND', '요청한 리소스를 찾을 수 없습니다.', data));
      }
    }

    // 400 Bad Request
    if (status === 400) {
      if (errorCode === 'INVALID_PARAMETER') {
        return Promise.reject(new ApiError(400, 'INVALID_PARAMETER', '잘못된 파라미터가 포함되어 있습니다.', data));
      } else if (errorCode === 'BAD_REQUEST') {
        return Promise.reject(new ApiError(400, 'BAD_REQUEST', errorMessage, data));
      }
    }

    // 500 Internal Server Error
    if (status === 500) {
      return Promise.reject(new ApiError(500, 'INTERNAL_SERVER_ERROR', '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', data));
    }

    // 기타 에러
    return Promise.reject(new ApiError(status, errorCode, errorMessage, data));
  }

  // 요청은 성공했으나 응답을 받지 못한 경우
  if (error.request) {
    return Promise.reject(new ApiError(0, 'NO_RESPONSE', '서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.', error.request));
  }

  // 요청 설정 중 에러가 발생한 경우
  return Promise.reject(new ApiError(0, 'REQUEST_SETUP_ERROR', '요청 처리 중 오류가 발생했습니다.', error.message));
};