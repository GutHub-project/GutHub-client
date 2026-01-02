import Image from "next/image";
import { useState } from "react";

import formattedDate from "./utils/formattedDate";

const DateStatus = () => {
  const [selectedDate, setSelectedDate] = useState(1);
  const dataArr = [
    formattedDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    formattedDate(new Date(Date.now())),
    formattedDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  ];

  const handleDateClick = (idx: number) => {
    setSelectedDate(idx);
  }

  // TODO: 실제 건강 상태 API 연동 필요
  // 현재는 임시로 '건강' 상태로 설정
  const isHealthy = true; // false로 변경하면 '아픈' 상태 표시

  const healthStatus = {
    character: isHealthy ? "/General/home/heal.png" : "/General/home/sick.png",
    background: isHealthy ? "/General/home/healbackground.png" : "/General/home/sickbackground.png",
    text: isHealthy ? "건강해요!" : "아파요..",
  };

  return (
    <div className="relative mt-[14px] px-[20px]">
      <div className="flex items-center justify-between">
        {dataArr.map((item, index) => (
          <button
            key={item}
            className={`text-gray-400 text-[14px] font-medium ${selectedDate === index ? "text-main border-b border-main" : ""}`}
            onClick={() => handleDateClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative flex justify-center items-center w-full h-[240px]">
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
      </div>
      <div className="w-full h-[38px] bg-Linear text-center text-text flex items-center justify-center rounded-[10px] opacity-100 gap-[3px]">
        <span className="text-[14px] text-text font-medium">내 장 상태 :</span>
        <span className="text-[14px] text-main font-medium">{healthStatus.text}</span>
      </div>
    </div>
  )
}

export default DateStatus;