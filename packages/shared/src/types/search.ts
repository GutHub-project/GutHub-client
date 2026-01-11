import type { CursorPaginatedResponse } from './api';

// ==================== 검색 API 타입 ====================

/**
 * 건강기능식품 정보
 */
export interface Supplement {
  supplementId: string;
  supplementName: string;
  imageUrl: string;
  avgRating: number;
  cntReview: number;
  brand: string;
  price: number;
}

/**
 * 제품 검색 응답
 */
export type ProductSearchResponse = CursorPaginatedResponse<Supplement>;
