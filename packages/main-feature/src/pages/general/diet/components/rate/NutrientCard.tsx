interface NutrientCardProps {
  title: string;
  amount: number;
  label?: string;
  bgColor?: string;
}

const NutrientCard = ({
  title,
  amount,
  bgColor,
  label,
}: NutrientCardProps) => {
  const progress = (amount / 100) * 100;

  return (
    <div className={`bg-Black-100 rounded-[10px] px-[11px] h-[60px] flex justify-center flex-col gap-[2px] ${label && 'border border-main'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-Black">
          {title}({amount}g)
        </span>
        {label && (
          <span
            className="text-[12px] font-medium px-[8px] py-[2px] rounded-[13px] bg-[#FFEADE] text-[#FF2C2C]"
          >
            {label}
          </span>
        )}
      </div>
      <div className="w-full h-[17px] bg-[#F5F5F5] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: bgColor,
          }}
        ></div>
      </div>
    </div>
  );
};

export default NutrientCard;

