interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="pt-[32px]">
      {children}
    </div>
  )
}

export default Layout;