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
      <div className="flex justify-center items-center w-full h-[240px]">
        <Image src="/AppBar/logo.svg" alt="gut" width={240} height={240} />
      </div>
      <div className="w-full h-[38px] bg-Linear text-center text-text flex items-center justify-center rounded-[10px] opacity-100 gap-[3px]">
        <span className="text-[14px] text-text font-medium">내 장 상태 :</span>
        <span className="text-[14px] text-main font-medium">아파요..</span>
      </div>
    </div>
  )
}

export default DateStatus;