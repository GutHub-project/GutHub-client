'use client';

import { AppBar, Layout as SharedLayout } from '@repo/shared';

interface LayoutProps {
  children: React.ReactNode;
  nickname?: string;
  streakCount?: number;
}

const Layout = ({ children, nickname = '허브', streakCount = 0 }: LayoutProps) => {
  return (
    <>
      <AppBar
        leftContent={<AppBar.MainLogo nickName={nickname} />}
        rightContent={
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold text-[#333]">{streakCount}일</span>
            <span className="text-[18px]">🔥</span>
          </div>
        }
        bgColor="bg-[#FFF5F5]"
      />
      <SharedLayout>{children}</SharedLayout>
    </>
  );
};

export default Layout;
