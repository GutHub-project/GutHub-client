'use client';

import Image from "next/image";
import { useState, useMemo } from "react";
import { gutHealthApi, type OverallGutHealthStatus } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

import formattedDate from "./utils/formattedDate";

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
const toISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DateStatus = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(1);
  
  // 어제, 오늘, 내일 날짜 배열
  const dates = useMemo(() => [
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    new Date(Date.now()),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  ], []);

  const displayDates = dates.map(d => formattedDate(d));
  const selectedDate = toISODateString(dates[selectedDateIndex]);

  // 장 건강 상태 조회
  const { data: gutHealthData, isLoading } = useQuery({
    queryKey: ['gutHealth', 'daily', selectedDate],
    queryFn: () => gutHealthApi.getDailyGutHealth(selectedDate),
    enabled: !!selectedDate,
  });

  const handleDateClick = (idx: number) => {
    setSelectedDateIndex(idx);
  };

  // 장 건강 상태에 따른 UI 설정
  const getHealthStatus = (status?: OverallGutHealthStatus) => {
    switch (status) {
      case 'GOOD':
        return {
          character: "/General/home/heal.png",
          background: "/General/home/healbackground.png",
          text: "건강해요!",
          isHealthy: true,
        };
      case 'NORMAL':
        return {
          character: "/General/home/heal.png",
          background: "/General/home/healbackground.png",
          text: "보통이에요",
          isHealthy: true,
        };
      case 'BAD':
        return {
          character: "/General/home/sick.png",
          background: "/General/home/sickbackground.png",
          text: "아파요..",
          isHealthy: false,
        };
      default:
        // 데이터가 없는 경우 기본값
        return {
          character: "/General/home/heal.png",
          background: "/General/home/healbackground.png",
          text: "기록해주세요",
          isHealthy: true,
        };
    }
  };

  const healthStatus = getHealthStatus(gutHealthData?.status);

  return (
    <div className="relative mt-[14px] px-[20px]">
      <div className="flex items-center justify-between">
        {displayDates.map((item, index) => (
          <button
            key={item}
            className={`text-gray-400 text-[14px] font-medium ${selectedDateIndex === index ? "text-main border-b border-main" : ""}`}
            onClick={() => handleDateClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative flex justify-center items-center w-full h-[240px]">
        {isLoading ? (
          <div className="text-gray-400">로딩 중...</div>
        ) : (
          <>
            {/* 캐릭터 - 중앙 */}
            <Image
              src={healthStatus.character}
              alt={healthStatus.text}
              width={200}
              height={200}
              className="relative z-10"
            />
            {/* 배경 - 오른쪽 하단 */}
            <Image
              src={healthStatus.background}
              alt="background"
              width={180}
              height={180}
              className="absolute right-0 bottom-0 z-0"
            />
          </>
        )}
      </div>
      <div className="w-full h-[38px] bg-Linear text-center text-text flex items-center justify-center rounded-[10px] opacity-100 gap-[3px]">
        <span className="text-[14px] text-text font-medium">내 장 상태 :</span>
        <span className="text-[14px] text-main font-medium">{healthStatus.text}</span>
        {gutHealthData?.violationReason && (
          <span className="text-[12px] text-gray-500 ml-2">({gutHealthData.violationReason})</span>
        )}
      </div>
    </div>
  );
};

export default DateStatus;
