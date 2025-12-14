interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mt-[32px]">
      {children}
    </div>
  )
}

export default Layout;