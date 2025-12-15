import { AppBar, Layout as SharedLayout } from "@repo/shared"; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#FFF5F5]">
      <AppBar leftContent={<AppBar.MainLogo nickName="허브" />} rightContent={<AppBar.Date date="4일" />} bgColor="bg-[#FFF5F5]" />
      <SharedLayout>{children}</SharedLayout>
    </div>
  )
}

export default Layout;