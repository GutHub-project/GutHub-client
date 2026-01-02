'use client';

import { BottomNavBar } from '@/components/BottomNavBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto pb-[70px]">{children}</main>
      <BottomNavBar />
    </div>
  );
}
