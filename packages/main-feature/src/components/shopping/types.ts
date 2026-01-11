// 상품 관련 타입
export interface Product {
  id: number;
  name: string;
  company: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  imageUrl?: string;
}

// 리뷰 관련 타입
export interface Review {
  id: number;
  userId: string;
  userName: string;
  age: string;
  healthType: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful?: number;
}

// 리뷰 필터 타입
export interface ReviewFilter {
  healthTypes: string[];
  ageGroups: string[];
  rating: number | null;
}

// 별점 분포 타입
export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

// 건강 유형 옵션
export const HEALTH_TYPE_OPTIONS = [
  '건강형',
  '변비형',
  '설사형',
  '가스·복부팽만형',
] as const;

// 연령대 옵션
export const AGE_GROUP_OPTIONS = [
  '10대',
  '20대',
  '30대',
  '40대',
] as const;

export type HealthType = typeof HEALTH_TYPE_OPTIONS[number];
export type AgeGroup = typeof AGE_GROUP_OPTIONS[number];
