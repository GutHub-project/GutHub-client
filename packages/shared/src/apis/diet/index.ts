import { privateApiInstance } from '../instance';
import type {
  ApiResponse,
  Food,
  DietLog,
  CreateDietRequest,
  UpdateDietRequest,
  DailyDietResponse,
  DietStreakResponse,
} from '../../types';

/**
 * 식단 관련 API 함수들
 */
export const dietApi = {
  /**
   * 식단 기록 생성
   * 특정 날짜에 여러 식사를 기록합니다.
   * @param data - 식단 기록 데이터 (logDate, items)
   * @returns 생성된 식단 기록 목록
   */
  createDiet: async (data: CreateDietRequest): Promise<DietLog[]> => {
    const response = await privateApiInstance.post<ApiResponse<DietLog[]>>(
      '/api/diets',
      data
    );
    return response.data.data;
  },

  /**
   * 날짜별 식단 조회
   * 특정 날짜의 모든 식단 기록을 조회합니다.
   * @param date - 조회 날짜 (YYYY-MM-DD 형식)
   * @returns 날짜별 식단 정보 (식단 기록, 영양소 정보, 장 건강 분석)
   */
  getDietsByDate: async (date: string): Promise<DailyDietResponse> => {
    const response = await privateApiInstance.get<ApiResponse<DailyDietResponse>>(
      '/api/diets',
      { params: { date } }
    );
    return response.data.data;
  },

  /**
   * 식단 상세 조회
   * 특정 식단 기록을 상세 조회합니다.
   * @param dietLogId - 식단 기록 ID
   * @returns 식단 기록 상세 정보
   */
  getDietById: async (dietLogId: number): Promise<DietLog> => {
    const response = await privateApiInstance.get<ApiResponse<DietLog>>(
      `/api/diets/${dietLogId}`
    );
    return response.data.data;
  },

  /**
   * 식단 수정
   * 기존 식단 기록을 수정합니다.
   * @param dietLogId - 식단 기록 ID
   * @param data - 수정할 데이터 (foodName, amount, mealType)
   * @returns 수정된 식단 기록
   */
  updateDiet: async (dietLogId: number, data: UpdateDietRequest): Promise<DietLog> => {
    const response = await privateApiInstance.put<ApiResponse<DietLog>>(
      `/api/diets/${dietLogId}`,
      data
    );
    return response.data.data;
  },

  /**
   * 식단 삭제
   * 특정 식단 기록을 삭제합니다.
   * @param dietLogId - 식단 기록 ID
   */
  deleteDiet: async (dietLogId: number): Promise<void> => {
    await privateApiInstance.delete(`/api/diets/${dietLogId}`);
  },

  /**
   * 음식 검색
   * 키워드로 음식을 검색합니다.
   * @param keyword - 검색 키워드
   * @returns 검색된 음식 목록
   */
  searchFoods: async (keyword: string): Promise<Food[]> => {
    const response = await privateApiInstance.get<ApiResponse<Food[]>>(
      '/api/diets/search-foods',
      { params: { keyword } }
    );
    return response.data.data;
  },

  /**
   * 장 건강 연속 유지일 조회
   * 현재 장 건강 연속 유지일(스트릭)을 조회합니다.
   * @returns 연속 유지일 정보
   */
  getStreak: async (): Promise<DietStreakResponse> => {
    const response = await privateApiInstance.get<ApiResponse<DietStreakResponse>>(
      '/api/diets/streak'
    );
    return response.data.data;
  },
};
