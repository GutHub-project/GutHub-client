'use client';

import { useState, useEffect } from 'react';
import type { ReviewFilter } from './types';
import { HEALTH_TYPE_OPTIONS, AGE_GROUP_OPTIONS } from './types';

interface ReviewFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilter: ReviewFilter;
  onApply: (filter: ReviewFilter) => void;
  totalReviewCount?: number;
}

export const ReviewFilterModal = ({
  isOpen,
  onClose,
  initialFilter,
  onApply,
  totalReviewCount = 0,
}: ReviewFilterModalProps) => {
  const [filter, setFilter] = useState<ReviewFilter>(initialFilter);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter, isOpen]);

  const handleHealthTypeToggle = (type: string) => {
    setFilter((prev) => ({
      ...prev,
      healthTypes: prev.healthTypes.includes(type)
        ? prev.healthTypes.filter((t) => t !== type)
        : [...prev.healthTypes, type],
    }));
  };

  const handleAgeGroupToggle = (age: string) => {
    setFilter((prev) => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(age)
        ? prev.ageGroups.filter((a) => a !== age)
        : [...prev.ageGroups, age],
    }));
  };

  const handleReset = () => {
    setFilter({
      healthTypes: [],
      ageGroups: [],
      rating: null,
    });
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl animate-slideUp safe-area-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-Black-200">
          <h2 className="text-lg font-semibold text-Black-800">리뷰</h2>
          <div className="flex items-center gap-1">
            <span className="text-main">만족도</span>
            <span className="text-lg font-bold text-Black-800">4.2</span>
            <span className="text-Black-600">/5</span>
            <div className="flex ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={star <= 4 ? 'text-main' : 'text-Black-300'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
          {/* 장 건강 유형 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-Black-800 mb-3">장 건강 유형</h3>
            <div className="flex flex-wrap gap-2">
              {HEALTH_TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => handleHealthTypeToggle(type)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filter.healthTypes.includes(type)
                      ? 'bg-main text-white'
                      : 'bg-Black-100 text-Black-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 연령대 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-Black-800 mb-3">연령대</h3>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUP_OPTIONS.map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeGroupToggle(age)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filter.ageGroups.includes(age)
                      ? 'bg-main text-white'
                      : 'bg-Black-100 text-Black-700'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* 별점 분포 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-Black-800 mb-3">별점</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = rating === 5 ? 134 : rating === 4 ? 8 : rating === 3 ? 4 : 0;
                const maxCount = 134;
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-Black-700 w-6">{rating}점</span>
                    <div className="flex-1 h-2 bg-Black-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-main rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-Black-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-4 py-4 border-t border-Black-200">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-Black-100 text-Black-700 font-medium rounded-xl"
          >
            ↻ 정보 재설정
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-main text-white font-medium rounded-xl"
          >
            N개 리뷰보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilterModal;
