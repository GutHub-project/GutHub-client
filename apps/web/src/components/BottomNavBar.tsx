'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'microorganismTest', href: '/microorganismTest', label: '미생물 검사' },
  { name: 'record', href: '/record', label: '기록' },
  { name: 'home', href: '/', label: '홈' },
  { name: 'shopping', href: '/shopping', label: '쇼핑' },
  { name: 'mypage', href: '/myPage', label: '마이' },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[71px] bg-white border-t border-[#e0e0e0] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      {/* 홈 버튼 위 곡선 배경 */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-[45px] w-[62px] h-[72px] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 50" className="drop-shadow-[0_-5px_7px_rgba(0,0,0,0.2)]">
          <path d="M0,50 A50,57 0 0,1 100,50" fill="white" stroke="none" />
        </svg>
      </div>

      <div className="flex items-center justify-between h-full px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isHome = tab.name === 'home';

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-[3px] ${isHome ? 'relative' : ''}`}
            >
              {isHome ? (
                <>
                  <div className="absolute -top-[40px] w-12 h-12 rounded-full bg-[#FF7878] flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.25)] z-10">
                    <Image
                      src="/BottomNav/tab-home.png"
                      alt="홈"
                      width={26}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#494949] mt-[14px]">{tab.label}</span>
                </>
              ) : (
                <>
                  <Image
                    src={`/BottomNav/tab-${tab.name}.png`}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className={`object-contain ${isActive ? 'opacity-100' : 'opacity-60'}`}
                  />
                  <span className={`text-xs ${isActive ? 'text-[#FF6B6B] font-semibold' : 'text-[#C2C2C2] font-normal'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
