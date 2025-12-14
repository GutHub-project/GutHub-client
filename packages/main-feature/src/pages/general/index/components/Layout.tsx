import { AppBar, Layout as SharedLayout } from "@repo/shared";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const leftContent = () => {
    return (
      <div className="flex items-center">
        <AppBar.LogoName />
        <span></span>
        <span>허브님의 하루</span>
      </div>
    )
  };
  return (
    <SharedLayout>
      <AppBar leftContent={leftContent()} />
      {children}
    </SharedLayout>
  )
}

export default Layout;