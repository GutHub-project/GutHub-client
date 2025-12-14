import { ReactNode } from 'react';

import BackButton from './BackButton';
import FireIcon from './FireIcon';
import Logo from './Logo';
import LogoName from './LogoName';

interface AppBarProps {
  leftContent?: ReactNode;
  text?: string;
  rightContent?: ReactNode;
}

const AppBar = ({ leftContent, text, rightContent }: AppBarProps) => {
  return (
    <div className="fixed top-0 left-auto right-auto z-100 flex justify-between items-center border-none pt-4 px-4 pb-2 w-full h-[32px]">
      <div className="flex items-start">
        {leftContent && <div className="mr-6 flex items-center">{leftContent}</div>}
        <span className="font-semibold text-[20px] whitespace-nowrap max-w-full">
          {text}
        </span>
      </div>
      <div>
        <div className="flex items-center cursor-pointer">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default AppBar;

AppBar.Logo = Logo;
AppBar.FireIcon = FireIcon;
AppBar.LogoName = LogoName;
AppBar.BackButton = BackButton;