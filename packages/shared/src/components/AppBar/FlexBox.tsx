import { twMerge } from "tailwind-merge";

export interface FlexBoxProps {
  children: React.ReactNode;
  className?: string;
}

const FlexBox = ({ children, className }: FlexBoxProps) => {
  return (
    <div className={twMerge("flex items-center gap-[6px]", className)}>
      {children}
    </div>
  )
}

export default FlexBox;