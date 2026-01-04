'use client';

import { BottomNavBar } from '@/components/BottomNavBar';
import { WebViewBridge } from '@/components/WebViewBridge';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FFF5F5]">
      {/* WebView와 네이티브 앱 간 통신 */}
      <WebViewBridge />

      {/* 메인 컨텐츠 - 상단바와 하단바 높이만큼 여백 */}
      <main
        className="pb-[70px] overflow-y-auto"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>

      {/* 하단 네비게이션 바 - 고정 */}
      <BottomNavBar />
    </div>
  );
}
