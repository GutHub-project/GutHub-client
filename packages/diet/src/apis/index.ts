// @repo/shared의 dietApi를 재export
export { dietApi } from '@repo/shared';

// 타입도 재export (MealType은 components/types에서 export하므로 제외)
export type { Food, DietLog, CreateDietRequest, UpdateDietRequest } from '@repo/shared';
