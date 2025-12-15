import { Icon } from "@repo/shared";

const Record = () => {
  const mealData = [
    {
      id: 1,
      icon: <Icon path="/General/breakfast.svg" width={33} height={32} color=""/>,
      title: '아침',
      date: '2025.10.10',
      tags: ['통곡물 시리얼', '귀리 우유', '...'],
    },
    {
      id: 2,
      icon: <Icon path="/General/lunch.svg" width={33} height={32} color=""/>,
      title: '점심',
      date: '2025.10.10',
      tags: ['조개구이', '사과 반쪽', '...'],
    },
    {
      id: 3,
      icon: <Icon path="/General/dinner.svg" width={33} height={32} color=""/>,
      title: '저녁',
      date: '2025.10.10',
      tags: ['탄장찌개', '발효국기', '...'],
    },
    {
      id: 4,
      icon: <Icon path="/General/snack.svg" width={33} height={32} color=""/>,
      title: '간식',
      date: '2025.10.10',
      tags: ['햄버거', '콜라', '김치튀김'],
    },
  ];

  return (
    <div className="flex items-start flex-col gap-[12px] w-full">
      <span className="text-[16px] font-semibold text-[#353535]">식단 기록</span>
      <section className="grid grid-cols-2 gap-[12px] w-full">
        {mealData.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-[12px] p-[8px] flex flex-col gap-[12px] shadow-[0_0_2.8px_0_rgba(255,179,179,0.41)] border border-sub/25"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] font-semibold">{meal.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text">
                    {meal.title}
                  </span>
                  <span className="text-[10px] text-Black-600 font-medium">{meal.date}</span>
                </div>
              </div>
              <button className="w-[12px] h-[12px] pt-[2px]">
                <Icon path="/General/plus-black-800-12.svg" width={12} height={12} color=""/>
              </button>
            </div>
            <div className="flex flex-wrap gap-[4px]">
              {meal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center justify-center text-[10px] text-Black-800 font-medium bg-white px-[4px] h-[20px] rounded-[4px] border border-[#FFE7E7]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Record;