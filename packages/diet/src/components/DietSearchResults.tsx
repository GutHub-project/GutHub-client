'use client';

import type { Food, SelectedFood } from './types';

interface DietSearchResultsProps {
  results: Food[];
  selectedFoods: SelectedFood[];
  onSelectFood: (food: Food) => void;
  onAddFood: (food: Food) => void;
  onRemoveFood: (foodId: number) => void;
  onBack: () => void;
  onComplete: () => void;
}

export function DietSearchResults({
  results,
  selectedFoods,
  onSelectFood,
  onAddFood,
  onRemoveFood,
  onBack,
  onComplete,
}: DietSearchResultsProps) {
  const isFoodSelected = (foodId: number) => {
    return selectedFoods.some((f) => f.id === foodId);
  };

  const handleFoodClick = (food: Food) => {
    if (isFoodSelected(food.id)) {
      onRemoveFood(food.id);
    } else {
      // 기본 1인분으로 추가
      onAddFood(food);
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
        <h1 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>식단 기록</h1>
      </div>

      {/* 컨텐츠 */}
      <div style={{ padding: '40px 20px', paddingBottom: '100px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          오늘 무슨 음식을 먹었나요?
        </h2>

        {/* 검색 결과 리스트 */}
        {results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999',
            }}
          >
            검색 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((food) => {
              const isSelected = isFoodSelected(food.id);
              const selectedFood = selectedFoods.find((f) => f.id === food.id);

              return (
                <div
                  key={food.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: isSelected ? '#FFF5F5' : '#fff',
                    border: isSelected ? '2px solid #FF7878' : '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleFoodClick(food)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#fff';
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#333',
                    }}
                  >
                    {food.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelected) {
                        onRemoveFood(food.id);
                      } else {
                        onSelectFood(food);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      color: isSelected ? '#FF7878' : '#999',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                    }}
                  >
                    {isSelected ? '✕' : '+'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 담긴 개수 표시 및 완료 버튼 */}
        {selectedFoods.length > 0 && (
          <button
            onClick={onComplete}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              right: '20px',
              padding: '16px',
              backgroundColor: '#FF7878',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {selectedFoods.length}개 담겼어요
          </button>
        )}
      </div>
    </div>
  );
}
