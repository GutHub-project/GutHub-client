import NutrientCard from "./NutrientCard";

const Rate = () => {
  return (
    <div className="flex items-start flex-col gap-[12px] w-full">
      <span className="text-[16px] font-semibold text-[#353535]">식단 비율</span>
      <section className="grid grid-cols-2 gap-[12px] w-full">
        {/* 식이섬유 - 전체 너비 차지 */}
        <div className="col-span-2">
          <NutrientCard
            title="식이섬유"
            amount={23}
            bgColor="#FFA4A4"
            label="높음"
          />
        </div>

        {/* 당류 */}
        <NutrientCard
          title="당류"
          amount={20}
          bgColor="#91B0FF"
        />

        {/* 포화지방 */}
        <NutrientCard
          title="포화지방"
          amount={10}
          bgColor="#F8B631"
        />

        {/* 밀가루 */}
        <NutrientCard
          title="밀가루"
          amount={30}
          bgColor="#FFE291"
        />

        {/* 정제 단수화물 비율 */}
        <NutrientCard
          title="정제 단수화물 비율"
          amount={5}
          bgColor="#FF78B7"
        />
      </section>
    </div>
  )
}

export default Rate;