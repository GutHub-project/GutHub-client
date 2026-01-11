import type { PaginatedResponse } from './api';

// ==================== 리뷰 API 타입 ====================

/**
 * 리뷰 작성 요청
 */
export interface CreateReviewRequest {
  supplementId: number;
  rating: number;
  deliveryRating?: number;
  content: string;
}

/**
 * 리뷰 정보
 */
export interface Review {
  reviewId: number;
  supplementId: number;
  writerNickname: string;
  rating: number;
  deliveryRating: number | null;
  content: string;
  createdAt: string;
}

/**
 * 리뷰 목록 응답
 */
export type ReviewListResponse = PaginatedResponse<Review>;
