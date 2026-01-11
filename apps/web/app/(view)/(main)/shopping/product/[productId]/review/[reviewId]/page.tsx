'use client';

import { use } from 'react';
import { ReviewDetailPage } from '@repo/main-feature';

interface PageProps {
  params: Promise<{
    productId: string;
    reviewId: string;
  }>;
}

export default function ReviewDetail({ params }: PageProps) {
  const { productId, reviewId } = use(params);
  return (
    <ReviewDetailPage 
      productId={Number(productId)} 
      reviewId={Number(reviewId)} 
    />
  );
}
