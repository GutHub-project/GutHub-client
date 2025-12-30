'use client';

import type { Food } from '../../apis/diet';

interface DietSearchResultsProps {
  results: Food[];
  onSelectFood: (food: Food) => void;
  onBack: () => void;
}

export function DietSearchResults({ results, onSelectFood, onBack }: DietSearchResultsProps) {
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
      <div style={{ padding: '40px 20px' }}>
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
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => onSelectFood(food)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
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
                <span
                  style={{
                    fontSize: '20px',
                    color: '#ff6b6b',
                  }}
                >
                  +
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 2개 담겼어요 버튼 */}
        <button
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '16px',
            backgroundColor: '#ff6b6b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          2개 담겼어요
        </button>
      </div>
    </div>
  );
}
