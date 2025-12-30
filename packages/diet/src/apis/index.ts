import { privateApiInstance } from '@repo/shared';

export interface Food {
  id: number;
  name: string;
}

export interface DietItem {
  foodName: string;
  amount: number;
  mealType: '아침' | '점심' | '저녁' | '간식';
}

export interface DietLog {
  dietLogId: number;
  foodId: number;
  foodName: string;
  logDate: string;
  amount: number;
  mealType: string;
}

export interface CreateDietRequest {
  logDate: string;
  items: DietItem[];
}

export interface CreateDietResponse {
  code: string;
  data: DietLog[];
  message: string;
}

export interface SearchFoodResponse {
  code: string;
  data: Food[];
  message: string;
}

/**
 * 식단 관련 API
 */
export const dietApi = {
  /**
   * 음식 검색
   * @param keyword - 검색 키워드
   */
  searchFoods: async (keyword: string): Promise<Food[]> => {
    const response = await privateApiInstance.get<SearchFoodResponse>(
      '/diets/search-foods',
      {
        params: { keyword },
      }
    );
    return response.data.data;
  },

  /**
   * 식단 기록 생성
   * @param data - 식단 기록 데이터
   */
  createDiet: async (data: CreateDietRequest): Promise<DietLog[]> => {
    const response = await privateApiInstance.post<CreateDietResponse>(
      '/diets',
      data
    );
    return response.data.data;
  },

  /**
   * 식단 기록 조회
   * @param dietLogId - 식단 로그 ID
   */
  getDiet: async (dietLogId: number): Promise<DietLog> => {
    const response = await privateApiInstance.get<{ code: string; data: DietLog; message: string }>(
      `/diets/${dietLogId}`
    );
    return response.data.data;
  },

  /**
   * 식단 기록 수정
   * @param dietLogId - 식단 로그 ID
   * @param data - 수정할 데이터
   */
  updateDiet: async (dietLogId: number, data: Partial<DietItem>): Promise<DietLog> => {
    const response = await privateApiInstance.put<{ code: string; data: DietLog; message: string }>(
      `/diets/${dietLogId}`,
      data
    );
    return response.data.data;
  },

  /**
   * 식단 기록 삭제
   * @param dietLogId - 식단 로그 ID
   */
  deleteDiet: async (dietLogId: number): Promise<void> => {
    await privateApiInstance.delete(`/diets/${dietLogId}`);
  },
};
