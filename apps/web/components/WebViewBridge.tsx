'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * WebView와 네이티브 앱 간 통신을 처리하는 컴포넌트
 * - 라우터 변경 시 히스토리 상태를 네이티브 앱에 전송
 * - 네이티브 앱의 뒤로가기 요청을 받아 라우터 처리
 */
export function WebViewBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // window.history.length를 사용하여 뒤로 갈 수 있는지 확인
    const canGoBack = window.history.length > 1;

    // 네이티브 앱에 히스토리 상태 전송
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'NAVIGATION_STATE',
          canGoBack,
        })
      );
    }
  }, [pathname]); // pathname 변경 시마다 실행

  useEffect(() => {
    // 네이티브 앱에서 보내는 메시지 수신
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'GO_BACK') {
          // 네이티브 앱의 뒤로가기 요청 처리
          router.back();
        }
      } catch (error) {
        // 메시지 파싱 실패 시 무시
      }
    };

    window.addEventListener('message', handleMessage);
    // React Native WebView는 'message' 대신 document에서 이벤트를 발생시킬 수 있음
    document.addEventListener('message', handleMessage as any);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
  }, [router]);

  return null; // UI를 렌더링하지 않음
}
