interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="pt-[32px]"
      style={{
        paddingTop: 'calc(32px + 1rem + env(safe-area-inset-top))'
      }}
    >
      {children}
    </div>
  )
}

export default Layout;