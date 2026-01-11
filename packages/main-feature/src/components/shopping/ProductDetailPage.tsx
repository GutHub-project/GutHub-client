'use client';

import { useState } from 'react';
import { AppBar, useAppRouter } from '@repo/shared';
import type { Product, Review, RatingDistribution } from './types';

// 더미 데이터
const DUMMY_PRODUCT: Product = {
  id: 1,
  name: '제약회사 | 제품 이름',
  company: '제약회사',
  description: '[1+1]구성 울트라 플로라 프로바이오틱스',
  rating: 4.5,
  reviewCount: 2302,
  price: 28200,
};

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
    age: '2C',
    healthType: '장 건강 유형',
    rating: 4,
    content: '나무 잘 먹고...',
    createdAt: '2024-01-09',
  },
];

interface ProductDetailPageProps {
  productId?: number;
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const { navigate } = useAppRouter();
  const [product] = useState<Product>(DUMMY_PRODUCT);
  const [reviews] = useState<Review[]>(DUMMY_REVIEWS);

  const handleGoBack = () => {
    navigate('back');
  };

  const handleViewAllReviews = () => {
    navigate('push', `/shopping/product/${productId}/reviews`);
  };

  const handleWriteReview = () => {
    navigate('push', `/shopping/product/${productId}/review/write`);
  };

  const handlePurchase = () => {
    // 구매하기 로직
    console.log('구매하기');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        leftContent={<AppBar.BackButton />}
        text="제품"
      />

      {/* 본문 컨텐츠 */}
      <div className="flex-1 pt-[calc(56px+env(safe-area-inset-top))] pb-20 overflow-y-auto">
        {/* 상품 이미지 */}
        <div className="w-full aspect-square bg-Black-200 flex items-center justify-center">
          <div className="w-32 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-md" />
        </div>

        {/* 상품 정보 */}
        <div className="px-4 py-4">
          <h1 className="text-lg font-semibold text-Black-800 mb-1">
            {product.company} | {product.name}
          </h1>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium text-Black-800">{product.rating}</span>
            <span className="text-sm text-Black-600">({product.reviewCount.toLocaleString()})</span>
          </div>
          <p className="text-sm text-Black-700 mb-3">{product.description}</p>
          <p className="text-xl font-bold text-Black-800">{product.price.toLocaleString()}</p>
        </div>

        {/* 유형별 균종 분석 */}
        <div className="px-4 py-4 border-t border-Black-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-Black-800">유형별 균종 분석</span>
            <span className="text-Black-600">{'>'}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-Black-600">🔥 장 건강 유형</span>
            <div className="flex-1 h-2 bg-Black-200 rounded-full overflow-hidden">
              <div className="h-full bg-main rounded-full" style={{ width: '65%' }} />
            </div>
            <span className="text-xs text-Black-600">4.4점</span>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="px-4 py-4 border-t border-Black-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-Black-800">리뷰</h2>
            <button 
              onClick={handleViewAllReviews}
              className="text-sm text-Black-600"
            >
              전체보기 {'>'}
            </button>
          </div>

          {/* 리뷰 미리보기 */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="flex-shrink-0 w-40 p-3 bg-Black-100 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-main/20 flex items-center justify-center">
                    <span className="text-xs text-main">●</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-Black-800 truncate">
                      {review.userName} | {review.age}
                    </p>
                    <p className="text-[10px] text-Black-600 truncate">
                      {review.healthType}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-Black-700 line-clamp-2">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-Black-200 safe-area-bottom">
        <button
          onClick={handlePurchase}
          className="w-full py-4 bg-main text-white font-semibold rounded-xl text-base"
        >
          구매하기
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
