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
];

export default function ShoppingPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', overflowY: 'auto' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
          GutHub | 하단남의 하루
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>4일</span>
          <span style={{ fontSize: '16px' }}>🔥</span>
        </div>
      </div>

      {/* 검색바 */}
      <div style={{
        margin: '12px 16px',
        padding: '12px 16px',
        backgroundColor: '#F5F5F5',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>제품명 또는 성분명 검색</div>
      </div>

      {/* 전체랭킹 섹션 */}
      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          marginBottom: '12px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', margin: 0 }}>전체랭킹</h2>
          <span style={{ fontSize: '18px', color: '#666' }}>{'>'}</span>
        </div>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          paddingLeft: '16px',
          gap: '12px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {PRODUCTS.map((product) => (
            <div key={product.id} style={{
              minWidth: '160px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #E5E5E5',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 1,
              }}>🔖</div>
              <div style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#F0F0F0',
                borderRadius: '8px',
                marginBottom: '8px',
              }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                {product.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px' }}>⭐</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{product.rating}</span>
                <span style={{ fontSize: '11px', color: '#666' }}>({product.reviews.toLocaleString()})</span>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>
                {product.description}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                {product.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 변비형에게 지금 인기있는 건강기능식품 섹션 */}
      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          marginBottom: '12px',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', flex: 1 }}>
            <span style={{ color: '#ff6b6b' }}>'변비형'</span> 에게 지금 인기있는 건강기능식품
          </div>
          <span style={{ fontSize: '18px', color: '#666' }}>{'>'}</span>
        </div>
        <div style={{ padding: '0 16px' }}>
          {HEALTH_PRODUCTS.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #F0F0F0',
            }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', width: '30px' }}>
                {item.rank}
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#F0F0F0',
                borderRadius: '8px',
                marginRight: '12px',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {item.category}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  {item.name}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                {item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
