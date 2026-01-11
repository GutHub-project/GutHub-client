'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gutHealthApi, dietApi, useAuthStore } from '@repo/shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Layout from './components/Layout';

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
const toISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 "M월 D일" 형식으로 변환
 */
const formatDisplayDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};

/**
 * 요일 배열
 */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 오늘 기준 일주일 날짜 배열 생성
 */
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: 일요일
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    dates.push(date);
  }
  
  return dates;
};

const General = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const nickname = user?.nickname || '허브';

  // 날짜 상태
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); // 어제/오늘/내일 중 오늘
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date().getDay()); // 요일 선택

  // 어제, 오늘, 내일 날짜 배열
  const dates = useMemo(
    () => [
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      new Date(Date.now()),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    ],
    []
  );

  const weekDates = useMemo(() => getWeekDates(), []);
  const selectedDate = toISODateString(dates[selectedDateIndex]);

  // 장 건강 상태 조회
  const { data: gutHealthData, isLoading: isGutHealthLoading } = useQuery({
    queryKey: ['gutHealth', 'daily', selectedDate],
    queryFn: () => gutHealthApi.getDailyGutHealth(selectedDate),
    enabled: !!selectedDate,
  });

  // 식단 조회
  const { data: dietData, isLoading: isDietLoading } = useQuery({
    queryKey: ['diet', selectedDate],
    queryFn: () => dietApi.getDietsByDate(selectedDate),
    enabled: !!selectedDate,
  });

  // 연속 유지일 조회
  const { data: streakData } = useQuery({
    queryKey: ['diet', 'streak'],
    queryFn: () => dietApi.getStreak(),
  });

  // 장 건강 상태에 따른 UI 설정
  const getHealthStatus = (status?: string) => {
    switch (status) {
      case 'GOOD':
        return {
          character: '/General/home/heal.png',
          text: '아주 좋아요!',
          textColor: 'text-[#FF6B6B]',
        };
      case 'NORMAL':
        return {
          character: '/General/home/heal.png',
          text: '보통이에요',
          textColor: 'text-[#FFB84D]',
        };
      case 'BAD':
        return {
          character: '/General/home/sick.png',
          text: '안좋아요..',
          textColor: 'text-[#FF6B6B]',
        };
      default:
        return {
          character: '/General/home/heal.png',
          text: '기록해주세요',
          textColor: 'text-[#999]',
        };
    }
  };

  const healthStatus = getHealthStatus(gutHealthData?.status);
  const streakCount = streakData?.streakCount ?? 0;

  // 영양소 데이터
  const nutrientInfo = dietData?.totalNutrientInfo || {
    totalDietaryFiber: 0,
    totalSugar: 0,
    totalSaturatedFat: 0,
    totalFlour: 0,
    totalRefinedCarbs: 0,
  };

  // 식단 기록 데이터
  const categorizedDietLogs = dietData?.categorizedDietLogs || {
    아침: [],
    점심: [],
    저녁: [],
    간식: [],
  };

  const handleAddMeal = (mealType: string) => {
    const mealTypeMap: Record<string, string> = {
      아침: 'BREAKFAST',
      점심: 'LUNCH',
      저녁: 'DINNER',
      간식: 'SNACK',
    };
    router.push(`/diet/record?mealType=${mealTypeMap[mealType]}&date=${selectedDate}`);
  };

  return (
    <Layout nickname={nickname} streakCount={streakCount}>
      <div className="flex flex-col min-h-screen bg-[#FFF5F5]">
        {/* 날짜 선택 섹션 */}
        <div className="flex items-center justify-center gap-8 py-4">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDateIndex(index)}
              className={`text-[14px] font-medium transition-all ${
                selectedDateIndex === index
                  ? 'text-[#FF7878] border-b-2 border-[#FF7878] pb-1'
                  : 'text-[#999]'
              }`}
            >
              {formatDisplayDate(date)}
            </button>
          ))}
        </div>

        {/* 장 캐릭터 섹션 */}
        <div className="flex flex-col items-center px-5 pb-6">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            {isGutHealthLoading ? (
              <div className="text-[#999] text-sm">로딩 중...</div>
            ) : (
              <Image
                src={healthStatus.character}
                alt="장 캐릭터"
                width={160}
                height={160}
                className="object-contain"
              />
            )}
          </div>
          <div className="text-center mt-2">
            <p className="text-[14px] text-[#666]">오늘의 장장이 상태는</p>
            <p className={`text-[20px] font-bold ${healthStatus.textColor}`}>{healthStatus.text}</p>
          </div>
        </div>

        {/* AI 추천 검색바 */}
        <div className="px-5 mb-4">
          <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-[#FFE7E7]">
            <span className="text-[14px] text-[#999] flex-1">AI, 오늘의 추천 식단은?</span>
            <button className="w-8 h-8 bg-[#FF7878] rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 카드 */}
        <div className="flex-1 bg-white rounded-t-[30px] px-5 pt-6 pb-24 shadow-[0px_-4px_20px_0px_rgba(255,120,120,0.1)]">
          {/* 나의 식단 기록 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#333]">나의 식단 기록</h2>
              <button
                onClick={() => handleAddMeal('아침')}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 요일 탭 */}
            <div className="flex justify-between mb-4">
              {WEEKDAYS.map((day, index) => {
                const isSelected = selectedWeekDay === index;
                const isToday = new Date().getDay() === index;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedWeekDay(index)}
                    className={`w-9 h-9 rounded-full text-[14px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#FF7878] text-white'
                        : isToday
                          ? 'bg-[#FFE7E7] text-[#FF7878]'
                          : 'text-[#999]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* 식단 카드 그리드 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 아침 카드 */}
              <MealCard
                icon="🍳"
                title="아침"
                date={selectedDate.replace(/-/g, '.')}
                foods={categorizedDietLogs.아침}
                onAdd={() => handleAddMeal('아침')}
                isLoading={isDietLoading}
              />
              {/* 점심 카드 */}
              <MealCard
                icon="🍱"
                title="점심"
                date={selectedDate.replace(/-/g, '.')}
                foods={categorizedDietLogs.점심}
                onAdd={() => handleAddMeal('점심')}
                isLoading={isDietLoading}
              />
              {/* 저녁 카드 */}
              <MealCard
                icon="🍲"
                title="저녁"
                date={selectedDate.replace(/-/g, '.')}
                foods={categorizedDietLogs.저녁}
                onAdd={() => handleAddMeal('저녁')}
                isLoading={isDietLoading}
              />
              {/* 간식 카드 */}
              <MealCard
                icon="🍪"
                title="간식"
                date={selectedDate.replace(/-/g, '.')}
                foods={categorizedDietLogs.간식}
                onAdd={() => handleAddMeal('간식')}
                isLoading={isDietLoading}
              />
            </div>
          </div>

          {/* 식단 비율 */}
          <div>
            <h2 className="text-[18px] font-bold text-[#333] mb-4">식단 비율</h2>

            <div className="space-y-4">
              {/* 식이섬유 */}
              <NutrientBar
                label="식이섬유"
                value={nutrientInfo.totalDietaryFiber}
                maxValue={30}
                color="#FFA4A4"
                unit="g"
              />

              {/* 당류 & 포화지방 */}
              <div className="grid grid-cols-2 gap-3">
                <NutrientBar
                  label="당류"
                  value={nutrientInfo.totalSugar}
                  maxValue={50}
                  color="#91B0FF"
                  unit="g"
                  compact
                />
                <NutrientBar
                  label="포화지방"
                  value={nutrientInfo.totalSaturatedFat}
                  maxValue={20}
                  color="#FFB84D"
                  unit="g"
                  compact
                />
              </div>

              {/* 밀가루 & 정제 탄수화물 */}
              <div className="grid grid-cols-2 gap-3">
                <NutrientBar
                  label="밀가루"
                  value={nutrientInfo.totalFlour}
                  maxValue={100}
                  color="#FFE291"
                  unit="g"
                  compact
                />
                <NutrientBar
                  label="정제 탄수화물 비율"
                  value={nutrientInfo.totalRefinedCarbs}
                  maxValue={100}
                  color="#E8E8E8"
                  unit="g"
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// 식단 카드 컴포넌트
interface MealCardProps {
  icon: string;
  title: string;
  date: string;
  foods: Array<{ foodName: string }>;
  onAdd: () => void;
  isLoading?: boolean;
}

const MealCard = ({ icon, title, date, foods, onAdd, isLoading }: MealCardProps) => {
  const foodTags = foods.length > 0 ? foods.slice(0, 2).map((f) => f.foodName) : [];
  const hasMore = foods.length > 2;

  return (
    <div className="bg-white rounded-2xl p-3 border border-[#FFE7E7] shadow-[0_2px_8px_rgba(255,120,120,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-[#FFF5F5] rounded-full flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-[#333]">{title}</p>
          <p className="text-[10px] text-[#999]">{date}</p>
        </div>
        <button onClick={onAdd} className="p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {isLoading ? (
          <span className="text-[11px] text-[#999]">로딩 중...</span>
        ) : foodTags.length > 0 ? (
          <>
            {foodTags.map((food, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-[#FFF8F8] text-[11px] text-[#666] rounded-md border border-[#FFE7E7]"
              >
                {food}
              </span>
            ))}
            {hasMore && (
              <span className="px-2.5 py-1 text-[11px] text-[#999]">...</span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-[#CCCCCC]">기록 없음</span>
        )}
      </div>
    </div>
  );
};

// 영양소 프로그레스 바 컴포넌트
interface NutrientBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit: string;
  compact?: boolean;
}

const NutrientBar = ({ label, value, maxValue, color, unit, compact }: NutrientBarProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="bg-[#FAFAFA] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold text-[#333] ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
          {label}({Math.round(value)}{unit})
        </span>
      </div>
      <div className="h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(percentage, 2)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default General;
