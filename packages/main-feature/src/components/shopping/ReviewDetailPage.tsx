'use client';

import { useState } from 'react';
import { AppBar, useAppRouter } from '@repo/shared';
import type { Review } from './types';

// 더미 리뷰 데이터
const DUMMY_REVIEW: Review = {
  id: 1,
  userId: 'user1',
  userName: '허벅지',
  age: '20대',
  healthType: '장 건강 유형 표시 (e.g. 건강형)',
  rating: 5,
  content: '주소 10자 이상 입력해주세요. 영양제, 유산균을 통해 바뀐 장 건강 기록을 작성해주세요!',
  createdAt: '2024-01-10',
  helpful: 12,
};

interface ReviewDetailPageProps {
  productId?: number;
  reviewId?: number;
}

export const ReviewDetailPage = ({ productId, reviewId }: ReviewDetailPageProps) => {
  const { navigate } = useAppRouter();
  const [review] = useState<Review>(DUMMY_REVIEW);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleGoBack = () => {
    navigate('back');
  };

  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
    // 도움이 됐어요 API 호출
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-lg ${star <= rating ? 'text-main' : 'text-Black-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        leftContent={<AppBar.BackButton />}
        text="리뷰상세"
      />

      {/* 본문 컨텐츠 */}
      <div className="flex-1 pt-[calc(56px+env(safe-area-inset-top))] pb-4 overflow-y-auto">
        {/* 리뷰어 정보 */}
        <div className="px-4 py-4 border-b border-Black-200">
          <div className="flex items-start gap-3">
            {/* 프로필 아이콘 */}
            <div className="w-12 h-12 rounded-full bg-main/20 flex items-center justify-center flex-shrink-0">
              <span className="text-main text-xl">●</span>
            </div>

            {/* 리뷰어 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-semibold text-Black-800">
                  {review.userName}
                </span>
                <span className="text-sm text-Black-600">|</span>
                <span className="text-sm text-Black-600">{review.age}</span>
              </div>
              <p className="text-xs text-Black-500 mb-2">
                {review.healthType}
              </p>
              {renderStars(review.rating)}
            </div>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="px-4 py-6">
          <p className="text-base text-Black-800 leading-relaxed whitespace-pre-wrap">
            {review.content}
          </p>
        </div>

        {/* Frame ID (디자인 참조용) */}
        <div className="px-4 py-2">
          <span className="text-xs text-Black-400">Frame 214722735</span>
        </div>

        {/* 도움이 됐어요 버튼 */}
        <div className="px-4 py-4">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
              isHelpful
                ? 'border-main bg-main/10 text-main'
                : 'border-Black-300 text-Black-600'
            }`}
          >
            <span>👍</span>
            <span className="text-sm">도움이 됐어요</span>
            {review.helpful && review.helpful > 0 && (
              <span className="text-sm">({review.helpful})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
