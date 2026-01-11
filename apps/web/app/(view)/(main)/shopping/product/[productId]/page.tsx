'use client';

import { use } from 'react';
import { ProductDetailPage } from '@repo/main-feature';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ProductDetail({ params }: PageProps) {
  const { productId } = use(params);
  return <ProductDetailPage productId={Number(productId)} />;
}
