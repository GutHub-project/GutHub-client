import { twMerge } from "tailwind-merge";

export interface TextProps {
  children: React.ReactNode;
  className?: string;
}

const Text = ({ children, className }: TextProps) => {
  return (
    <span className={twMerge("text-[20px] font-semibold ", className)}>{children}</span>
  )
};

export default Text;