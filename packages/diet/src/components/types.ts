import type { Food } from '../apis';

export type MealType = '아침' | '점심' | '저녁' | '간식';

export interface SelectedFood extends Food {
  amount: number;
}
