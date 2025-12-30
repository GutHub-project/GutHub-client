'use client';

// 더미 데이터
const PRODUCTS = [
  {
    id: 1,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 2,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 3,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
];

const HEALTH_PRODUCTS = [
  {
    id: 1,
    rank: 1,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 2,
    rank: 2,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 3,
    rank: 3,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 4,
    rank: 4,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 5,
    rank: 5,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
];

export function ShoppingPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', overflowY: 'auto' }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
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
            <span style={{ color: '#ff6b6b' }}>&apos;변비형&apos;</span> 에게 지금 인기있는 건강기능식품
          </div>
          <div style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}>더보기 &gt;</div>
        </div>

        {/* 가로 스크롤 상품 목록 */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px' }}>
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
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
                }}
              >
                <span style={{ fontSize: '40px' }}>📦</span>
              </div>
              {/* 상품 정보 */}
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#ffa500' }}>⭐</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {product.rating} ({product.reviews.toLocaleString()})
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>{product.description}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                  {product.price.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {HEALTH_PRODUCTS.map((product) => (
            <div
              key={product.id}
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
                  color: product.rank <= 3 ? '#ff6b6b' : '#999',
                  marginRight: '12px',
                  minWidth: '24px',
                }}
              >
                {product.rank}
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
                }}
              >
                <span style={{ fontSize: '24px' }}>📦</span>
              </div>
              {/* 상품 정보 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>{product.category}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  {product.name}
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
      </div>
    </div>
  );
}
