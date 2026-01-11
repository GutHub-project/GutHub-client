import { publicApiInstance } from '../instance';
import type {
  ApiResponse,
  ProductSearchResponse,
} from '../../types';

/**
 * 검색 관련 API 함수들
 */
export const searchApi = {
  /**
   * 제품 검색
   * 키워드로 건강기능식품을 검색합니다. 커서 기반 페이지네이션을 지원합니다.
   * @param query - 검색 키워드
   * @param cursor - 페이지네이션 커서 (첫 페이지는 생략)
   * @returns 검색 결과 (커서 기반 페이지네이션)
   */
  searchProducts: async (
    query: string,
    cursor?: string
  ): Promise<ProductSearchResponse> => {
    const response = await publicApiInstance.get<ApiResponse<ProductSearchResponse>>(
      '/api/search/products',
      {
        params: {
          q: query,
          ...(cursor && { cursor }),
        },
      }
    );
    return response.data.data;
  },
};
