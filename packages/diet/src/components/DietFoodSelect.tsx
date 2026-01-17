'use client';

import { useState } from 'react';
import type { Food } from '../apis';

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#FFF5F5',
            border: '2px solid #FF7878',
            borderRadius: '12px',
            marginBottom: '60px',
            width: '100%',
          }}
        >
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
              {initialAmount || 1}인분 ({Math.round((initialAmount || 1) * 76)}g)
            </span>
          </div>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#999',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
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
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#666',
              }}
            >
              총
            </span>
            <button
              onClick={handleDecrease}
              disabled={amount <= 0.5}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: amount <= 0.5 ? '#f0f0f0' : '#FF7878',
                color: '#fff',
                fontSize: '20px',
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
                fontSize: '24px',
                fontWeight: '700',
                color: '#333',
                minWidth: '40px',
                textAlign: 'center',
              }}
            >
              {amount}
            </span>

            <button
              onClick={handleIncrease}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#FF7878',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#666',
              }}
            >
              인분 먹었어요
            </span>
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <button
          onClick={handleAdd}
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
          수정하기
        </button>
      </div>
    </div>
  );
}
