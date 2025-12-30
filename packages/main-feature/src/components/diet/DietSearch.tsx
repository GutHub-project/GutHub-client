'use client';

import { useState } from 'react';
import { dietApi } from '../../apis/diet';
import type { MealType } from './types';
import type { Food } from '../../apis/diet';

interface DietSearchProps {
  mealType: MealType;
  onSearch: (results: Food[]) => void;
  onBack: () => void;
}

export function DietSearch({ mealType, onSearch, onBack }: DietSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      setIsLoading(true);
      const results = await dietApi.searchFoods(keyword);
      onSearch(results);
    } catch (error) {
      console.error('음식 검색 실패:', error);
      alert('음식 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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

        {/* 검색 입력 */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '12px 16px',
            }}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
            <input
              type="text"
              placeholder="제품명 또는 성분명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: '#333',
              }}
            />
          </div>
        </div>

        {/* 검색 버튼 (모바일 키보드 제출용) */}
        {keyword && (
          <button
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '14px',
              backgroundColor: isLoading ? '#e0e0e0' : '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '검색 중...' : '검색하기'}
          </button>
        )}

        {/* N개 담겼어요 버튼 - 추후 추가 가능 */}
        <button
          disabled
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '16px',
            backgroundColor: '#e0e0e0',
            color: '#999',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'not-allowed',
          }}
        >
          N개 담겼어요
        </button>
      </div>
    </div>
  );
}
