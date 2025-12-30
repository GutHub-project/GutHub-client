'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAuthStore } from '@repo/shared';

/**
 * 소셜 로그인 성공 페이지
 * - 기존 회원: accessToken을 받아서 메인으로 이동
 * - 신규 회원: tempToken을 받아서 프로필 설정으로 이동
 * - 네이티브 앱의 WebView에서는 이 페이지가 로드되기 전에 URL이 가로채짐
 */
function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const tempToken = searchParams.get('tempToken');

    if (accessToken) {
      // 기존 회원: accessToken 저장 후 메인으로 이동
      setAccessToken(accessToken);
      router.replace('/');
    } else if (tempToken) {
      // 신규 회원: 프로필 설정 페이지로 이동
      router.replace(`/profile-setup?tempToken=${tempToken}`);
    } else {
      // 토큰이 없으면 로그인 페이지로
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