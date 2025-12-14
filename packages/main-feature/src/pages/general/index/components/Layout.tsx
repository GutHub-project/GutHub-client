import { AppBar, Layout as SharedLayout } from "@repo/shared"; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar leftContent={<AppBar.MainLogo nickName="허브" />} rightContent={<AppBar.Date date="4일" />} />
      <SharedLayout>{children}</SharedLayout>
    </>
  )
}

export default Layout;