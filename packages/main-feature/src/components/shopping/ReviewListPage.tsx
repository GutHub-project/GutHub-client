'use client';

import { useState } from 'react';
import { AppBar, useAppRouter } from '@repo/shared';
import { ReviewFilterModal } from './ReviewFilterModal';
import type { Review, ReviewFilter, RatingDistribution } from './types';

// 더미 리뷰 데이터
const DUMMY_REVIEWS: Review[] = [
  {
    id: 1,
    userId: 'user1',
    userName: '허벅지',
    age: '20대',
    healthType: '장 건강 유형 표시(e.g. 건강형)',
    rating: 5,
    content: '나무 잘 먹고있어요**',
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    userId: 'user2',
    userName: '허벅지',
    age: '20대',
    healthType: '장 건강 유형 표시(e.g. 건강형)',
    rating: 4,
    content: '나무 잘 먹고있어요**',
    createdAt: '2024-01-09',
  },
  {
    id: 3,
    userId: 'user3',
    userName: '허벅지',
    age: '20대',
    healthType: '장 건강 유형 표시(e.g. 건강형)',
    rating: 5,
    content: '나무 잘 먹고있어요**',
    createdAt: '2024-01-08',
  },
];

const RATING_DISTRIBUTION: RatingDistribution = {
  5: 134,
  4: 8,
  3: 4,
  2: 0,
  1: 0,
};

interface ReviewListPageProps {
  productId?: number;
}

export const ReviewListPage = ({ productId }: ReviewListPageProps) => {
  const { navigate } = useAppRouter();
  const [reviews] = useState<Review[]>(DUMMY_REVIEWS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>({
    healthTypes: [],
    ageGroups: [],
    rating: null,
  });

  const averageRating = 4.2;
  const totalReviews = reviews.length;

  const handleGoBack = () => {
    navigate('back');
  };

  const handleReviewClick = (reviewId: number) => {
    navigate('push', `/shopping/product/${productId}/review/${reviewId}`);
  };

  const handleFilterApply = (newFilter: ReviewFilter) => {
    setFilter(newFilter);
    // 필터 적용 로직
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-sm ${star <= rating ? 'text-main' : 'text-Black-300'}`}
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
        text="리뷰"
        rightContent={
          <div className="flex items-center gap-1">
            <span className="text-main text-sm">만족도</span>
            <span className="font-bold text-Black-800">{averageRating}</span>
            <span className="text-Black-600 text-sm">/5</span>
            {renderStars(Math.round(averageRating))}
          </div>
        }
      />

      {/* 본문 컨텐츠 */}
      <div className="flex-1 pt-[calc(56px+env(safe-area-inset-top))] pb-4 overflow-y-auto">
        {/* 필터 버튼 */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-Black-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="text-sm text-Black-600"
            >
              🔽 장 건강 유형별 보기
            </button>
          </div>
          <span className="text-sm text-Black-600">필터 ▼</span>
        </div>

        {/* 리뷰 개수 */}
        <div className="px-4 py-3">
          <span className="text-sm font-medium text-Black-800">총 {totalReviews}건</span>
        </div>

        {/* 리뷰 목록 */}
        <div className="px-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => handleReviewClick(review.id)}
              className="py-4 border-b border-Black-100 cursor-pointer active:bg-Black-50"
            >
              <div className="flex items-start gap-3">
                {/* 프로필 아이콘 */}
                <div className="w-10 h-10 rounded-full bg-main/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-main text-lg">●</span>
                </div>

                {/* 리뷰 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-Black-800">
                      {review.userName}
                    </span>
                    <span className="text-xs text-Black-600">|</span>
                    <span className="text-xs text-Black-600">{review.age}</span>
                  </div>
                  <p className="text-xs text-Black-500 mb-2 truncate">
                    {review.healthType}
                  </p>
                  <p className="text-sm text-Black-700 line-clamp-2">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 필터 모달 */}
      <ReviewFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilter={filter}
        onApply={handleFilterApply}
        totalReviewCount={totalReviews}
      />
    </div>
  );
};

export default ReviewListPage;
