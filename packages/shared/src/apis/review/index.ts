import { publicApiInstance, privateApiInstance } from '../instance';
import type {
  ApiResponse,
  CreateReviewRequest,
  Review,
  ReviewListResponse,
} from '../../types';

/**
 * 리뷰 관련 API 함수들
 */
export const reviewApi = {
  /**
   * 리뷰 작성
   * 특정 건강기능식품에 대한 리뷰를 작성합니다.
   * @param data - 리뷰 작성 데이터 (supplementId, rating, deliveryRating, content)
   * @returns 생성된 리뷰 정보
   */
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await privateApiInstance.post<ApiResponse<Review>>(
      '/api/reviews',
      data
    );
    return response.data.data;
  },

  /**
   * 리뷰 목록 조회
   * 특정 건강기능식품의 리뷰 목록을 조회합니다.
   * @param supplementId - 건강기능식품 ID
   * @param params - 페이지네이션 파라미터 (page, size, sort)
   * @returns 리뷰 목록 (페이지네이션)
   */
  getReviews: async (
    supplementId: number,
    params?: {
      page?: number;
      size?: number;
      sort?: string;
    }
  ): Promise<ReviewListResponse> => {
    const response = await publicApiInstance.get<ApiResponse<ReviewListResponse>>(
      `/api/reviews/${supplementId}`,
      { params }
    );
    return response.data.data;
  },
};
