'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gutHealthApi, dietApi, type MonthlyGutHealthItem, type OverallGutHealthStatus } from '@repo/shared';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 월의 첫 번째 날이 무슨 요일인지 반환 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 */
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * 월의 마지막 날짜 반환
 */
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * 월을 YYYY-MM 형식으로 반환
 */
const formatMonth = (year: number, month: number): string => {
  return `${year}-${String(month).padStart(2, '0')}`;
};

export function RecordPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const monthString = formatMonth(currentYear, currentMonth);

  // 월별 장 건강 점수 조회
  const { data: gutHealthData, isLoading: isGutHealthLoading } = useQuery({
    queryKey: ['gutHealth', 'monthly', monthString],
    queryFn: () => gutHealthApi.getMonthlyGutHealth(monthString),
  });

  // 장 건강 연속 유지일 조회
  const { data: streakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ['diet', 'streak'],
    queryFn: () => dietApi.getStreak(),
  });

  // 날짜별 상태 맵 생성
  const statusMap = useMemo(() => {
    const map = new Map<number, MonthlyGutHealthItem>();
    if (gutHealthData?.statusList) {
      gutHealthData.statusList.forEach((item) => {
        const day = parseInt(item.date.split('-')[2], 10);
        map.set(day, item);
      });
    }
    return map;
  }, [gutHealthData]);

  // 캘린더 그리드 생성
  const calendarGrid = useMemo(() => {
    const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const grid: Array<{ date: number | null; status: OverallGutHealthStatus | 'none' }> = [];

    // 첫 주의 빈 셀 추가
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push({ date: null, status: 'none' });
    }

    // 실제 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const healthItem = statusMap.get(day);
      grid.push({
        date: day,
        status: healthItem?.status || 'none',
      });
    }

    return grid;
  }, [currentYear, currentMonth, statusMap]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getStatusColor = (status: OverallGutHealthStatus | 'none') => {
    switch (status) {
      case 'GOOD':
        return '#4CAF50'; // 녹색
      case 'NORMAL':
        return '#FFC107'; // 노란색
      case 'BAD':
        return '#F44336'; // 빨간색
      default:
        return 'transparent';
    }
  };

  const streakCount = streakData?.streakCount ?? 0;
  const isLoading = isGutHealthLoading || isStreakLoading;

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
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>GutHub | 하단남의 하루</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{streakCount}일</span>
          <span style={{ fontSize: '16px' }}>🔥</span>
        </div>
      </div>

      {/* 월 선택 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          gap: '24px',
        }}
      >
        <button
          onClick={handlePrevMonth}
          style={{
            fontSize: '20px',
            color: '#666',
            fontWeight: '600',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          {'<'}
        </button>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
          {currentYear}년 {currentMonth}월
        </span>
        <button
          onClick={handleNextMonth}
          style={{
            fontSize: '20px',
            color: '#666',
            fontWeight: '600',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          {'>'}
        </button>
      </div>

      {/* 연속일 표시 */}
      <div style={{ margin: '0 16px 20px 16px' }}>
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFF3E0',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
            장 건강 유지 연속일{' '}
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#ff6b6b' }}>
              {streakCount}일🔥
            </span>
          </span>
        </div>
      </div>

      {/* 캘린더 */}
      <div
        style={{
          margin: '0 16px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E5E5E5',
        }}
      >
        {/* 요일 헤더 */}
        <div style={{ display: 'flex', marginBottom: '12px' }}>
          {WEEKDAYS.map((day, index) => (
            <div key={index} style={{ flex: 1, textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: index === 0 ? '#F44336' : index === 6 ? '#2196F3' : '#666',
                }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>로딩 중...</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {calendarGrid.map((day, index) => (
              <div
                key={index}
                style={{
                  width: '14.28%',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 0',
                }}
              >
                {day.date && (
                  <>
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                      {day.date}
                    </span>
                    {day.status !== 'none' && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: getStatusColor(day.status),
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 여백 */}
      <div style={{ height: '40px' }} />
    </div>
  );
}
