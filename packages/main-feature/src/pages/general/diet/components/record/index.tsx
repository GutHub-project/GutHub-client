'use client';

import { Icon, dietApi, type CategorizedDietLogs, type DietLog } from "@repo/shared";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 표시용 형식으로 변환
 */
const formatDisplayDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${year}.${month}.${day}`;
};

interface MealCardProps {
  icon: React.ReactNode;
  title: string;
  mealType: string;
  date: string;
  logs: DietLog[];
  onAdd: () => void;
}

const MealCard = ({ icon, title, date, logs, onAdd }: MealCardProps) => {
  // 음식 이름 태그 생성 (최대 3개)
  const tags = useMemo(() => {
    if (logs.length === 0) return ['기록 없음'];
    const foodNames = logs.map(log => log.foodName);
    if (foodNames.length <= 3) return foodNames;
    return [...foodNames.slice(0, 2), '...'];
  }, [logs]);

  return (
    <div className="bg-white rounded-[12px] p-[8px] flex flex-col gap-[12px] shadow-[0_0_2.8px_0_rgba(255,179,179,0.41)] border border-sub/25">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[8px]">
          <span className="text-[14px] font-semibold">{icon}</span>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-text">{title}</span>
            <span className="text-[10px] text-Black-600 font-medium">{date}</span>
          </div>
        </div>
        <button className="w-[12px] h-[12px] pt-[2px]" onClick={onAdd}>
          <Icon path="/General/plus-black-800-12.svg" width={12} height={12} color="" />
        </button>
      </div>
      <div className="flex flex-wrap gap-[4px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`flex items-center justify-center text-[10px] font-medium bg-white px-[4px] h-[20px] rounded-[4px] border ${
              logs.length === 0 ? 'text-gray-400 border-gray-200' : 'text-Black-800 border-[#FFE7E7]'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Record = () => {
  const router = useRouter();
  const today = getTodayDate();
  const displayDate = formatDisplayDate(today);

  // 오늘 식단 조회
  const { data: dietData, isLoading } = useQuery({
    queryKey: ['diet', today],
    queryFn: () => dietApi.getDietsByDate(today),
  });

  const handleAddMeal = (mealType: string) => {
    router.push(`/diet/record?mealType=${mealType}&date=${today}`);
  };

  // 식사 타입별 데이터
  const mealTypes: Array<{
    id: number;
    icon: React.ReactNode;
    title: string;
    mealType: keyof CategorizedDietLogs;
    mealTypeParam: string;
  }> = [
    {
      id: 1,
      icon: <Icon path="/General/breakfast.svg" width={33} height={32} color="" />,
      title: '아침',
      mealType: '아침',
      mealTypeParam: 'BREAKFAST',
    },
    {
      id: 2,
      icon: <Icon path="/General/lunch.svg" width={33} height={32} color="" />,
      title: '점심',
      mealType: '점심',
      mealTypeParam: 'LUNCH',
    },
    {
      id: 3,
      icon: <Icon path="/General/dinner.svg" width={33} height={32} color="" />,
      title: '저녁',
      mealType: '저녁',
      mealTypeParam: 'DINNER',
    },
    {
      id: 4,
      icon: <Icon path="/General/snack.svg" width={33} height={32} color="" />,
      title: '간식',
      mealType: '간식',
      mealTypeParam: 'SNACK',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-start flex-col gap-[12px] w-full">
        <span className="text-[16px] font-semibold text-[#353535]">식단 기록</span>
        <div className="text-gray-400 text-center w-full py-4">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex items-start flex-col gap-[12px] w-full">
      <span className="text-[16px] font-semibold text-[#353535]">식단 기록</span>
      <section className="grid grid-cols-2 gap-[12px] w-full">
        {mealTypes.map((meal) => (
          <MealCard
            key={meal.id}
            icon={meal.icon}
            title={meal.title}
            mealType={meal.mealTypeParam}
            date={displayDate}
            logs={dietData?.categorizedDietLogs?.[meal.mealType] || []}
            onAdd={() => handleAddMeal(meal.mealTypeParam)}
          />
        ))}
      </section>
    </div>
  );
};

export default Record;
