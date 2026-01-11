'use client';

import { use } from 'react';
import { ReviewWritePage } from '@repo/main-feature';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ReviewWrite({ params }: PageProps) {
  const { productId } = use(params);
  return <ReviewWritePage productId={Number(productId)} />;
}
