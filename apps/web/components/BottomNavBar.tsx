'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function BottomNavBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'microorganismTest', path: '/microorganismTest', label: '미생물 검사', icon: '/BottomNav/tab-microorganismTest.png' },
    { name: 'record', path: '/record', label: '기록', icon: '/BottomNav/tab-record.png' },
    { name: 'home', path: '/', label: '홈', icon: '/BottomNav/tab-home.png' },
    { name: 'shopping', path: '/shopping', label: '쇼핑', icon: '/BottomNav/tab-shopping.png' },
    { name: 'mypage', path: '/myPage', label: '마이', icon: '/BottomNav/tab-mypage.png' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-[70px] px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <Link
              key={tab.name}
              href={tab.path}
              className="flex flex-col items-center justify-center flex-1 py-2 active:scale-95 transition-transform"
            >
              <div className={`mb-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                />
              </div>
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-[#FF6B6B] font-semibold' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
