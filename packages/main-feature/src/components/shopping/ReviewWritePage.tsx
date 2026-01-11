'use client';

import { useState } from 'react';
import { AppBar, useAppRouter } from '@repo/shared';
import type { Product } from './types';

// 더미 상품 데이터
const DUMMY_PRODUCT: Product = {
  id: 1,
  name: '제품 이름',
  company: '제약회사',
  description: '[1+1]구성 울트라 플로라 프로바이오틱스',
  rating: 4.5,
  reviewCount: 2302,
  price: 28200,
};

interface ReviewWritePageProps {
  productId?: number;
}

export const ReviewWritePage = ({ productId }: ReviewWritePageProps) => {
  const { navigate } = useAppRouter();
  const [product] = useState<Product>(DUMMY_PRODUCT);
  const [deliveryRating, setDeliveryRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>('');

  const handleGoBack = () => {
    navigate('back');
  };

  const handleSubmitReview = () => {
    if (deliveryRating === 0) {
      alert('배송 만족도를 선택해주세요.');
      return;
    }
    if (reviewContent.trim().length === 0) {
      alert('후기를 작성해주세요.');
      return;
    }
    
    // 리뷰 제출 로직
    console.log('리뷰 제출:', { deliveryRating, reviewContent });
    navigate('back');
  };

  const renderStars = (rating: number, onSelect: (rating: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onSelect(star)}
            className="text-2xl"
          >
            {star <= rating ? (
              <span className="text-main">★</span>
            ) : (
              <span className="text-Black-400">☆</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        leftContent={<AppBar.BackButton />}
        text="리뷰작성"
      />

      {/* 본문 컨텐츠 */}
      <div className="flex-1 pt-[calc(56px+env(safe-area-inset-top))] pb-24 overflow-y-auto">
        {/* 상품 정보 카드 */}
        <div className="px-4 py-4 border-b border-Black-200">
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-Black-200 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-Black-800 mb-1">
                {product.company} | {product.name}
              </p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-xs text-Black-800">{product.rating}</span>
                <span className="text-xs text-Black-600">({product.reviewCount.toLocaleString()})</span>
              </div>
              <p className="text-sm font-bold text-main">
                {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 배송 만족도 */}
        <div className="px-4 py-6 border-b border-Black-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-Black-800">이 제품은 어떠셨나요?</h3>
            <span className="text-sm text-Black-600">배송 만족도</span>
          </div>
          {renderStars(deliveryRating, setDeliveryRating)}
        </div>

        {/* 후기 작성 */}
        <div className="px-4 py-6">
          <h3 className="text-base font-semibold text-Black-800 mb-4">후기 작성</h3>
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="주소 10자 이상 입력해주세요. 영양제, 유산균을 통해 바뀐 장 건강 기록을 작성해주세요!"
            className="w-full h-40 p-4 bg-Black-100 rounded-xl text-sm text-Black-800 placeholder:text-Black-500 resize-none focus:outline-none focus:ring-2 focus:ring-main/30"
            maxLength={500}
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-Black-600">
              {reviewContent.length}/10,000(최소 10자)
            </span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-Black-200 safe-area-bottom">
        <button
          onClick={handleSubmitReview}
          className="w-full py-4 bg-main text-white font-semibold rounded-xl text-base"
        >
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
};

export default ReviewWritePage;
