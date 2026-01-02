'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'microorganismTest', path: '/microorganismTest', label: '미생물 검사', icon: '🔬' },
    { name: 'record', path: '/record', label: '기록', icon: '📝' },
    { name: 'home', path: '/', label: '홈', icon: '🏠' },
    { name: 'shopping', path: '/shopping', label: '쇼핑', icon: '🛒' },
    { name: 'mypage', path: '/myPage', label: '마이', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-[70px] px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <Link
              key={tab.name}
              href={tab.path}
              className="flex flex-col items-center justify-center flex-1 py-2"
            >
              <span className={`text-2xl mb-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.icon}
              </span>
              <span
                className={`text-xs ${
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
