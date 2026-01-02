import { AppBar, Layout as SharedLayout } from "@repo/shared";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#FFF5F5]">
      <AppBar leftContent={<AppBar.MainLogo nickName="허브" />} rightContent={<AppBar.Date date="4일" />} bgColor="bg-[#FFF5F5]" />
      <SharedLayout>
        {/* 하단 네비게이션 바는 (main) 레이아웃에서 처리 */}
        {children}
      </SharedLayout>
    </div>
  )
}

export default Layout;