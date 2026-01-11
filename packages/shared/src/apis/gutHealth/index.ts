import { privateApiInstance } from '../instance';
import type {
  ApiResponse,
  DailyGutHealthResponse,
  MonthlyGutHealthResponse,
} from '../../types';

/**
 * 장 건강 관련 API 함수들
 */
export const gutHealthApi = {
  /**
   * 일별 장 건강 점수 조회
   * 특정 날짜의 장 건강 점수를 조회합니다.
   * @param date - 조회 날짜 (YYYY-MM-DD 형식)
   * @returns 일별 장 건강 점수 정보
   */
  getDailyGutHealth: async (date: string): Promise<DailyGutHealthResponse> => {
    const response = await privateApiInstance.get<ApiResponse<DailyGutHealthResponse>>(
      '/users/me/gut-health',
      { params: { date } }
    );
    return response.data.data;
  },

  /**
   * 월별 장 건강 점수 조회
   * 특정 월의 장 건강 점수 목록을 조회합니다.
   * @param month - 조회 월 (YYYY-MM 형식)
   * @returns 월별 장 건강 점수 목록
   */
  getMonthlyGutHealth: async (month: string): Promise<MonthlyGutHealthResponse> => {
    const response = await privateApiInstance.get<ApiResponse<MonthlyGutHealthResponse>>(
      '/users/me/gut-health/monthly',
      { params: { month } }
    );
    return response.data.data;
  },
};
