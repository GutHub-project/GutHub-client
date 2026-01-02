'use client';

export default function MicroorganismTestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          color: '#000',
        }}>
          미생물 검사
        </h1>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        {/* 아이콘 */}
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
        }}>
          🔬
        </div>

        {/* 타이틀 */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '12px',
        }}>
          서비스 준비중입니다
        </h2>

        {/* 설명 */}
        <p style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '280px',
        }}>
          더 나은 서비스를 제공하기 위해<br />
          열심히 준비하고 있습니다.<br />
          조금만 기다려주세요!
        </p>
      </div>
    </div>
  );
}
