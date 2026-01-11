import type { Food, MealType as SharedMealType } from '@repo/shared';

// MealType을 한글로 정의 (UI 표시용)
export type MealType = '아침' | '점심' | '저녁' | '간식';

// API에서 사용하는 MealType과의 매핑
export const MealTypeToApi: Record<MealType, SharedMealType> = {
  '아침': 'BREAKFAST',
  '점심': 'LUNCH',
  '저녁': 'DINNER',
  '간식': 'SNACK',
};

export const ApiToMealType: Record<SharedMealType, MealType> = {
  'BREAKFAST': '아침',
  'LUNCH': '점심',
  'DINNER': '저녁',
  'SNACK': '간식',
};

export interface SelectedFood extends Food {
  amount: number;
}

// 재export
export type { Food } from '@repo/shared';
