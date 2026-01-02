'use client';

import HomePage from './(view)/(main)/home/page';
import { BottomNavBar } from '@/components/BottomNavBar';
import { WebViewBridge } from '@/components/WebViewBridge';

export default function Web() {
  return (
    <div className="relative min-h-screen bg-[#FFF5F5]">
      <WebViewBridge />
      <main
        className="pb-[70px] overflow-y-auto"
        style={{
          paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
        }}
      >
        <HomePage />
      </main>
      <BottomNavBar />
    </div>
  );
}
