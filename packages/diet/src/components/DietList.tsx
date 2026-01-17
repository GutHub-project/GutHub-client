'use client';

import { useState } from 'react';
import { dietApi } from '@repo/shared';
import type { MealType, SelectedFood, MealTypeToApi } from './types';

interface DietListProps {
  mealType: MealType;
  foods: SelectedFood[];
  date?: string; // YYYY-MM-DD 형식
  onEdit: (foodId: number) => void;
  onRemove: (foodId: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

// MealType 매핑
const mealTypeMap: Record<MealType, 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'> = {
  '아침': 'BREAKFAST',
  '점심': 'LUNCH',
  '저녁': 'DINNER',
  '간식': 'SNACK',
};

export function DietList({ mealType, foods, date, onEdit, onRemove, onComplete, onBack }: DietListProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (foods.length === 0) {
      alert('음식을 추가해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      // 날짜 (props로 받거나 현재 날짜 사용)
      const logDate = date || new Date().toISOString().split('T')[0];
      const apiMealType = mealTypeMap[mealType];

      // API 요청 데이터 생성
      const requestData = {
        logDate,
        items: foods.map((food) => ({
          foodName: food.name,
          amount: food.amount,
          mealType: apiMealType,
        })),
      };

      await dietApi.createDiet(requestData);
      alert('식단 기록이 완료되었습니다!');
      onComplete();
    } catch (error) {
      console.error('식단 기록 실패:', error);
      alert('식단 기록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          position: 'relative',
        }}
      >
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{mealType}</h1>
      </div>

      {/* 컨텐츠 */}
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        {foods.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}
          >
            추가된 음식이 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {foods.map((food) => (
              <div
                key={food.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '2px solid #ff6b6b',
                  borderRadius: '24px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      {food.name}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '400',
                      }}
                    >
                      {food.amount}인분 {food.amount ? `(${Math.round(food.amount * 76)}g)` : ''}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onEdit(food.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fff',
                      color: '#ff6b6b',
                      border: '1px solid #ff6b6b',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onRemove(food.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fff',
                      color: '#999',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 식단 기록 완료 버튼 */}
        <button
          onClick={handleComplete}
          disabled={isLoading || foods.length === 0}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '16px',
            backgroundColor: isLoading || foods.length === 0 ? '#e0e0e0' : '#ff6b6b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading || foods.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? '저장 중...' : '식단 기록 완료'}
        </button>
      </div>
    </div>
  );
}
