import { colors } from '@repo/tailwind-config/colors';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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

export const RecordScreen = () => {
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
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>GutHub | 하단남의 하루</Text>
        <View style={styles.streak}>
          <Text style={styles.streakText}>4일</Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
      </View>

      {/* 월 선택 */}
      <View style={styles.monthSelector}>
        <Text style={styles.arrow}>{'<'}</Text>
        <Text style={styles.monthText}>
          {CALENDAR_DATA.year}년 {CALENDAR_DATA.month}월
        </Text>
        <Text style={styles.arrow}>{'>'}</Text>
      </View>

      {/* 연속일 표시 */}
      <View style={styles.streakBanner}>
        <Text style={styles.streakBannerText}>
          장 건강 유지 연속일 <Text style={styles.streakDays}>4일🔥</Text>
        </Text>
      </View>

      {/* 캘린더 */}
      <View style={styles.calendar}>
        {/* 요일 헤더 */}
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day, index) => (
            <View key={index} style={styles.weekdayCell}>
              <Text
                style={[
                  styles.weekdayText,
                  index === 0 && styles.sundayText,
                  index === 6 && styles.saturdayText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* 날짜 그리드 */}
        <View style={styles.datesGrid}>
          {calendarGrid.map((day, index) => (
            <View key={index} style={styles.dateCell}>
              {day.date && (
                <>
                  <Text style={styles.dateText}>{day.date}</Text>
                  {day.status !== 'none' && (
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(day.status) },
                      ]}
                    />
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 하단 여백 */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  fireEmoji: {
    fontSize: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 24,
  },
  arrow: {
    fontSize: 20,
    color: colors['Black-600'],
    fontWeight: '600',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors['Black-800'],
  },
  streakBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  streakBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.main,
  },
  calendar: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-700'],
  },
  sundayText: {
    color: '#F44336',
  },
  saturdayText: {
    color: '#2196F3',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%', // 7일 = 100% / 7
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors['Black-800'],
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bottomSpace: {
    height: 40,
  },
});
