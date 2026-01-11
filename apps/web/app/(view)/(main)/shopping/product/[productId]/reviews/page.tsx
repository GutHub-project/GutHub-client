'use client';

import { use } from 'react';
import { ReviewListPage } from '@repo/main-feature';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ReviewList({ params }: PageProps) {
  const { productId } = use(params);
  return <ReviewListPage productId={Number(productId)} />;
}
