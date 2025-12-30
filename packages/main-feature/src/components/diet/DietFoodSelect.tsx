'use client';

import { useState } from 'react';
import type { Food } from '../../apis/diet';

interface DietFoodSelectProps {
  food: Food;
  initialAmount?: number;
  onAdd: (food: Food, amount: number) => void;
  onBack: () => void;
}

export function DietFoodSelect({ food, initialAmount = 1, onAdd, onBack }: DietFoodSelectProps) {
  const [amount, setAmount] = useState(initialAmount);

  const handleDecrease = () => {
    if (amount > 0.5) {
      setAmount((prev) => Math.round((prev - 0.5) * 10) / 10);
    }
  };

  const handleIncrease = () => {
    setAmount((prev) => Math.round((prev + 0.5) * 10) / 10);
  };

  const handleAdd = () => {
    onAdd(food, amount);
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '40px 20px',
        }}
      >
        {/* 선택된 음식 */}
        <div
          style={{
            padding: '20px 40px',
            backgroundColor: '#fff',
            border: '2px solid #ff6b6b',
            borderRadius: '24px',
            marginBottom: '60px',
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
              fontSize: '12px',
              color: '#ff6b6b',
              marginLeft: '8px',
            }}
          >
            1인분 (76g)
          </span>
          <button
            onClick={onBack}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>

        {/* 수량 조절 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={handleDecrease}
            disabled={amount <= 0.5}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: amount <= 0.5 ? '#f0f0f0' : '#ff6b6b',
              color: '#fff',
              fontSize: '24px',
              cursor: amount <= 0.5 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            −
          </button>

          <span
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#333',
              minWidth: '60px',
              textAlign: 'center',
            }}
          >
            {amount}
          </span>

          <button
            onClick={handleIncrease}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>

        {/* 인분 먹었어요 텍스트 */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#666',
          }}
        >
          인분 먹었어요
        </div>

        {/* 목록에 담기 버튼 */}
        <button
          onClick={handleAdd}
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
          목록에 담기
        </button>
      </div>
    </div>
  );
}
