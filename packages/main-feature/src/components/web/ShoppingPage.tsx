'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi, userApi, type Supplement } from '@repo/shared';

export function ShoppingPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 사용자 프로필 조회 (장 건강 유형 확인용)
  const { data: profileData } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    retry: false,
  });

  // 제품 검색
  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', 'products', searchQuery],
    queryFn: () => searchApi.searchProducts(searchQuery),
    enabled: !!searchQuery,
  });

  // 인기 제품 (프로바이오틱스로 기본 검색)
  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['search', 'products', 'popular'],
    queryFn: () => searchApi.searchProducts('프로바이오틱스'),
  });

  const handleSearch = useCallback(() => {
    if (searchKeyword.trim()) {
      setSearchQuery(searchKeyword.trim());
    }
  }, [searchKeyword]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const gutTypeName = profileData?.gutType?.name || '변비형';
  const products: Supplement[] = searchQuery
    ? searchData?.supplementList || []
    : popularData?.supplementList || [];
  const isLoading = searchQuery ? isSearchLoading : isPopularLoading;

  // 랭킹 데이터 (상위 5개)
  const rankingProducts = products.slice(0, 5);

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', overflowY: 'auto' }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          paddingTop: 'calc(12px + env(safe-area-inset-top))',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
          GutHub | 건강한 장 건강 솔루션
        </div>
        <div style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</div>
      </div>

      {/* 검색바 */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '12px 16px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
          <input
            type="text"
            placeholder="제품명 또는 성분명을 검색해주세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              color: '#666',
            }}
          />
        </div>
      </div>

      {/* 상품 섹션 */}
      <div style={{ padding: '0 16px 24px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', flex: 1 }}>
            <span style={{ color: '#ff6b6b' }}>&apos;{gutTypeName}&apos;</span> 에게 지금 인기있는 건강기능식품
          </div>
          <div style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}>더보기 &gt;</div>
        </div>

        {/* 가로 스크롤 상품 목록 */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>로딩 중...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            {searchQuery ? '검색 결과가 없습니다.' : '상품이 없습니다.'}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px' }}>
            {products.slice(0, 6).map((product) => (
              <div
                key={product.supplementId}
                style={{
                  minWidth: '160px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* 상품 이미지 */}
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.supplementName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '40px' }}>📦</span>
                  )}
                </div>
                {/* 상품 정보 */}
                <div style={{ padding: '12px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.brand}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#ffa500' }}>⭐</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {product.avgRating.toFixed(1)} ({product.cntReview.toLocaleString()})
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.supplementName}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                    {product.price.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 랭킹 섹션 */}
      <div style={{ padding: '0 16px 24px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', flex: 1 }}>
            오늘의 건강기능식품 랭킹
          </div>
          <div style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}>더보기 &gt;</div>
        </div>

        {/* 랭킹 목록 */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>로딩 중...</div>
        ) : rankingProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>랭킹 데이터가 없습니다.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rankingProducts.map((product, index) => (
              <div
                key={product.supplementId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  cursor: 'pointer',
                }}
              >
                {/* 순위 */}
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: index < 3 ? '#ff6b6b' : '#999',
                    marginRight: '12px',
                    minWidth: '24px',
                  }}
                >
                  {index + 1}
                </div>
                {/* 상품 이미지 */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    overflow: 'hidden',
                  }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.supplementName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px' }}>📦</span>
                  )}
                </div>
                {/* 상품 정보 */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>{product.brand}</div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.supplementName}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>
                    {product.price.toLocaleString()}원
                  </div>
                </div>
                {/* 화살표 */}
                <div style={{ fontSize: '16px', color: '#ccc' }}>&gt;</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
