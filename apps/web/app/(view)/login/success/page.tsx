'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAuthStore } from '@repo/shared';

/**
 * 소셜 로그인 성공 페이지 (기존 회원)
 * - 백엔드가 OAuth 성공 후 이 페이지로 리다이렉트 (accessToken 포함)
 * - accessToken을 저장하고 메인 페이지로 이동
 * - 신규 회원은 백엔드가 자동으로 /profile-setup으로 보냄
 * - 네이티브 앱의 WebView에서는 이 페이지가 로드되기 전에 URL이 가로채짐
 */
function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      // 기존 회원: accessToken 저장 후 메인으로 이동
      setAccessToken(accessToken);
      router.replace('/');
    } else {
      // accessToken이 없으면 에러 (백엔드가 잘못 리다이렉트한 경우)
      console.error('No accessToken in /login/success');
      router.replace('/login');
    }
  }, [searchParams, router, setAccessToken]);

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