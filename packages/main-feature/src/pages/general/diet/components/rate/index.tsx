'use client';

import { dietApi, type TotalNutrientInfo } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import NutrientCard from "./NutrientCard";

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
 * 영양소 수치에 따른 라벨 반환
 */
const getNutrientLabel = (amount: number, type: 'good' | 'bad'): string | undefined => {
  if (type === 'good') {
    // 좋은 영양소 (식이섬유, 프로바이오틱스): 높을수록 좋음
    if (amount >= 25) return '높음';
    if (amount >= 15) return '보통';
    if (amount > 0) return '낮음';
    return undefined;
  } else {
    // 나쁜 영양소 (당류, 포화지방 등): 낮을수록 좋음
    if (amount >= 30) return '높음';
    if (amount >= 15) return '보통';
    if (amount > 0) return '낮음';
    return undefined;
  }
};

const Rate = () => {
  const today = getTodayDate();

  // 오늘 식단 조회
  const { data: dietData, isLoading } = useQuery({
    queryKey: ['diet', today],
    queryFn: () => dietApi.getDietsByDate(today),
  });

  const nutrientInfo: TotalNutrientInfo = dietData?.totalNutrientInfo || {
    totalCalories: 0,
    totalDietaryFiber: 0,
    totalProbiotics: 0,
    totalSaturatedFat: 0,
    totalSugar: 0,
    totalRefinedCarbs: 0,
    totalFlour: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-start flex-col gap-[12px] w-full">
        <span className="text-[16px] font-semibold text-[#353535]">식단 비율</span>
        <div className="text-gray-400 text-center w-full py-4">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex items-start flex-col gap-[12px] w-full">
      <span className="text-[16px] font-semibold text-[#353535]">식단 비율</span>
      <section className="grid grid-cols-2 gap-[12px] w-full">
        {/* 식이섬유 - 전체 너비 차지 */}
        <div className="col-span-2">
          <NutrientCard
            title="식이섬유"
            amount={Math.round(nutrientInfo.totalDietaryFiber)}
            bgColor="#FFA4A4"
            label={getNutrientLabel(nutrientInfo.totalDietaryFiber, 'good')}
          />
        </div>

        {/* 당류 */}
        <NutrientCard
          title="당류"
          amount={Math.round(nutrientInfo.totalSugar)}
          bgColor="#91B0FF"
          label={getNutrientLabel(nutrientInfo.totalSugar, 'bad')}
        />

        {/* 포화지방 */}
        <NutrientCard
          title="포화지방"
          amount={Math.round(nutrientInfo.totalSaturatedFat)}
          bgColor="#F8B631"
          label={getNutrientLabel(nutrientInfo.totalSaturatedFat, 'bad')}
        />

        {/* 밀가루 */}
        <NutrientCard
          title="밀가루"
          amount={Math.round(nutrientInfo.totalFlour)}
          bgColor="#FFE291"
          label={getNutrientLabel(nutrientInfo.totalFlour, 'bad')}
        />

        {/* 정제 탄수화물 비율 */}
        <NutrientCard
          title="정제 탄수화물"
          amount={Math.round(nutrientInfo.totalRefinedCarbs)}
          bgColor="#FF78B7"
          label={getNutrientLabel(nutrientInfo.totalRefinedCarbs, 'bad')}
        />
      </section>
    </div>
  );
};

export default Rate;
