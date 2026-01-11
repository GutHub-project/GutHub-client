/**
 * API 공통 응답 형식
 */
export interface ApiResponse<T = null> {
  code: string;
  message: string;
  data: T;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

/**
 * 커서 기반 페이지네이션 응답
 */
export interface CursorPaginatedResponse<T> {
  query: string;
  supplementList: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

// ==================== Enum 정의 ====================

/**
 * 식사 타입
 */
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

/**
 * 식사 타입 표시명 매핑
 */
export const MealTypeLabel: Record<MealType, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  SNACK: '간식',
};

/**
 * 성별
 */
export type Gender = 'MALE' | 'FEMALE';

/**
 * 성별 표시명 매핑
 */
export const GenderLabel: Record<Gender, string> = {
  MALE: '남성',
  FEMALE: '여성',
};

/**
 * 영양소 타입
 */
export type Nutrient =
  | 'DIETARY_FIBER'
  | 'PROBIOTICS'
  | 'SATURATED_FAT'
  | 'SUGAR'
  | 'REFINED_CARBS'
  | 'FLOUR';

/**
 * 영양소 표시명 매핑
 */
export const NutrientLabel: Record<Nutrient, string> = {
  DIETARY_FIBER: '식이섬유',
  PROBIOTICS: '프로바이오틱스',
  SATURATED_FAT: '포화지방',
  SUGAR: '당',
  REFINED_CARBS: '정제탄수화물',
  FLOUR: '밀가루',
};

/**
 * 영양소 상태
 */
export type NutrientStatus = 'OPTIMAL' | 'EXCEEDED' | 'BELOW_MIN';

/**
 * 영양소 상태 표시명 매핑
 */
export const NutrientStatusLabel: Record<NutrientStatus, string> = {
  OPTIMAL: '적정',
  EXCEEDED: '초과',
  BELOW_MIN: '미달',
};

/**
 * 전체 장 건강 상태
 */
export type OverallGutHealthStatus = 'GOOD' | 'NORMAL' | 'BAD';

/**
 * 장 건강 상태 표시명 매핑
 */
export const OverallGutHealthStatusLabel: Record<OverallGutHealthStatus, string> = {
  GOOD: '좋음',
  NORMAL: '보통',
  BAD: '나쁨',
};
