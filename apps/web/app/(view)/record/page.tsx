'use client';

// 더미 데이터 - 2025년 1월 캘린더
const CALENDAR_DATA = {
  year: 2025,
  month: 1,
  days: [
    { date: 1, status: 'none' },
    { date: 2, status: 'good' }, // 녹색
    { date: 3, status: 'good' },
    { date: 4, status: 'good' },
    { date: 5, status: 'bad' }, // 빨간색
    { date: 6, status: 'none' },
    { date: 7, status: 'none' },
    { date: 8, status: 'good' },
    { date: 9, status: 'good' },
    { date: 10, status: 'good' },
    { date: 11, status: 'good' },
    { date: 12, status: 'none' },
    { date: 13, status: 'none' },
    { date: 14, status: 'none' },
    { date: 15, status: 'good' },
    { date: 16, status: 'good' },
    { date: 17, status: 'bad' },
    { date: 18, status: 'good' },
    { date: 19, status: 'none' },
    { date: 20, status: 'none' },
    { date: 21, status: 'none' },
    { date: 22, status: 'good' },
    { date: 23, status: 'good' },
    { date: 24, status: 'good' },
    { date: 25, status: 'good' },
    { date: 26, status: 'none' },
    { date: 27, status: 'none' },
    { date: 28, status: 'none' },
    { date: 29, status: 'none' },
    { date: 30, status: 'none' },
    { date: 31, status: 'none' },
  ],
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 1월 1일이 수요일이라고 가정 (2025년 실제)
const FIRST_DAY_OF_WEEK = 3; // 0: 일요일, 1: 월요일, ..., 6: 토요일

export default function RecordPage() {
  // 빈 셀을 포함한 캘린더 그리드 생성
  const calendarGrid = [];

  // 첫 주의 빈 셀 추가
  for (let i = 0; i < FIRST_DAY_OF_WEEK; i++) {
    calendarGrid.push({ date: null, status: 'none' });
  }

  // 실제 날짜 추가
  calendarGrid.push(...CALENDAR_DATA.days);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#4CAF50'; // 녹색
      case 'bad':
        return '#F44336'; // 빨간색
      default:
        return 'transparent';
    }
  };

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

      {/* 월 선택 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        gap: '24px',
      }}>
        <span style={{ fontSize: '20px', color: '#666', fontWeight: '600' }}>{'<'}</span>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
          {CALENDAR_DATA.year}년 {CALENDAR_DATA.month}월
        </span>
        <span style={{ fontSize: '20px', color: '#666', fontWeight: '600' }}>{'>'}</span>
      </div>

      {/* 연속일 표시 */}
      <div style={{
        margin: '0 16px 20px',
        padding: '16px 20px',
        backgroundColor: '#FFF3E0',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
          장 건강 유지 연속일{' '}
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#ff6b6b' }}>4일🔥</span>
        </span>
      </div>

      {/* 캘린더 */}
      <div style={{
        margin: '0 16px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #E5E5E5',
      }}>
        {/* 요일 헤더 */}
        <div style={{
          display: 'flex',
          marginBottom: '12px',
        }}>
          {WEEKDAYS.map((day, index) => (
            <div key={index} style={{
              flex: 1,
              textAlign: 'center',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: index === 0 ? '#F44336' : index === 6 ? '#2196F3' : '#555',
              }}>
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          {calendarGrid.map((day, index) => (
            <div key={index} style={{
              width: '14.28%', // 7일 = 100% / 7
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 0',
            }}>
              {day.date && (
                <>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '4px',
                  }}>
                    {day.date}
                  </span>
                  {day.status !== 'none' && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: getStatusColor(day.status),
                    }} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 여백 */}
      <div style={{ height: '40px' }} />
    </div>
  );
}
