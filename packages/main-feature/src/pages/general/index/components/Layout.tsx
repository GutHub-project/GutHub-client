import { AppBar, Layout as SharedLayout } from "@repo/shared";
import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트로 동적 로드
const BottomNavBar = dynamic(
  () => import('../../../../../../apps/web/src/components/BottomNavBar').then(mod => ({ default: mod.BottomNavBar })),
  { ssr: false }
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#FFF5F5]">
      <AppBar leftContent={<AppBar.MainLogo nickName="허브" />} rightContent={<AppBar.Date date="4일" />} bgColor="bg-[#FFF5F5]" />
      <SharedLayout>
        <div className="pb-[100px]">
          {children}
        </div>
      </SharedLayout>
      <BottomNavBar />
    </div>
  )
}

export default Layout;