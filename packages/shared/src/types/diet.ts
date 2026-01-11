import type { MealType, NutrientStatus, OverallGutHealthStatus } from './api';

// ==================== 식단 API 타입 ====================

/**
 * 음식 정보
 */
export interface Food {
  id: number;
  name: string;
}

/**
 * 식단 항목 (생성/수정 시 사용)
 */
export interface DietItem {
  foodName: string;
  amount?: number;
  mealType: MealType;
}

/**
 * 식단 기록
 */
export interface DietLog {
  dietLogId: number;
  foodId: number;
  foodName: string;
  logDate: string;
  amount: number;
  mealType: string;
}

/**
 * 식단 기록 생성 요청
 */
export interface CreateDietRequest {
  logDate: string;
  items: DietItem[];
}

/**
 * 식단 기록 수정 요청
 */
export interface UpdateDietRequest {
  foodName: string;
  amount?: number;
  mealType: MealType;
}

/**
 * 영양소별 비교 정보
 */
export interface NutrientComparison {
  nutrientName: string;
  dailyIntake: number;
  minLimit: number | null;
  maxLimit: number | null;
  status: NutrientStatus;
  isExceeded: boolean;
  isBelowMin: boolean;
}

/**
 * 장 건강 분석 정보
 */
export interface GutHealthAnalysis {
  overallStatus: OverallGutHealthStatus;
  comparisons: NutrientComparison[];
}

/**
 * 총 영양소 정보
 */
export interface TotalNutrientInfo {
  totalCalories: number;
  totalDietaryFiber: number;
  totalProbiotics: number;
  totalSaturatedFat: number;
  totalSugar: number;
  totalRefinedCarbs: number;
  totalFlour: number;
}

/**
 * 식사 타입별 식단 기록
 */
export interface CategorizedDietLogs {
  아침: DietLog[];
  점심: DietLog[];
  저녁: DietLog[];
  간식: DietLog[];
}

/**
 * 날짜별 식단 조회 응답
 */
export interface DailyDietResponse {
  date: string;
  categorizedDietLogs: CategorizedDietLogs;
  totalNutrientInfo: TotalNutrientInfo;
  gutHealthAnalysis: GutHealthAnalysis;
}

/**
 * 장 건강 연속 유지일 응답
 */
export interface DietStreakResponse {
  streakCount: number;
  lastRecordDate: string;
}
