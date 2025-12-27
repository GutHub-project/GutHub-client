'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

/**
 * 소셜 로그인 성공 페이지
 * - 네이티브 앱의 WebView에서는 이 페이지가 로드되기 전에 URL이 가로채짐
 * - 웹 브라우저에서 직접 접속 시에만 이 페이지가 표시됨
 */
function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      // 웹 환경: localStorage에 토큰 저장 후 홈으로 이동
      localStorage.setItem('accessToken', accessToken);
      router.replace('/');
    } else {
      // accessToken이 없으면 로그인 페이지로
      router.replace('/login');
    }
  }, [searchParams, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      로그인 처리 중...
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        로그인 처리 중...
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}