import LogoName from "./LogoName";

const MainLogo = ({ nickName }: { nickName: string }) => {
  return (
    <div className="flex items-center gap-[6px]">
      <LogoName />
      <div className="h-[13px] w-px bg-text"></div>
      <span className="text-[16px] font-semibold">{nickName}님의 하루</span>
    </div>
  )
};

export default MainLogo;