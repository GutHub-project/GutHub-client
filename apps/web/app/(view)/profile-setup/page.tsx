'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 프로필 설정 페이지
 * - 네이티브 앱의 WebView에서는 이 페이지가 로드되기 전에 URL이 가로채짐
 * - 웹 브라우저에서 직접 접속 시에만 이 페이지가 표시됨
 */
export default function ProfileSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tempToken = searchParams.get('tempToken');

    if (tempToken) {
      // 웹 환경: tempToken을 URL 파라미터로 전달하여 프로필 설정 페이지로 이동
      // TODO: 웹용 프로필 설정 화면 구현 필요
      console.log('[ProfileSetup] tempToken:', tempToken);
      alert('웹에서는 아직 프로필 설정 기능이 구현되지 않았습니다. 네이티브 앱을 사용해주세요.');
      router.replace('/login');
    } else {
      // tempToken이 없으면 로그인 페이지로
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
      프로필 설정 중...
    </div>
  );
}