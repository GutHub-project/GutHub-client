'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAuthStore, userApi } from '@repo/shared';

/**
 * 소셜 로그인 성공 페이지 (기존 회원)
 * - 백엔드가 OAuth 성공 후 이 페이지로 리다이렉트 (accessToken 포함)
 * - accessToken을 저장하고 유저 정보를 불러온 후 메인 페이지로 이동
 * - 신규 회원은 백엔드가 자동으로 /profile-setup으로 보냄
 * - 네이티브 앱의 WebView에서는 이 페이지가 로드되기 전에 URL이 가로채짐
 */
function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setUser } = useAuthStore();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const accessToken = searchParams.get('accessToken');

      if (accessToken) {
        try {
          // 1. Access Token 저장
          await setAccessToken(accessToken);
          
          // 2. 유저 정보 불러오기
          try {
            const userInfo = await userApi.getProfile();
            setUser({
              nickname: userInfo.nickname || '',
              ageRange: userInfo.ageRange || 0,
              gender: userInfo.gender || '',
              gutType: userInfo.gutType || {
                code: '',
                name: '',
                description: '',
                imageUrl: '',
              },
            });
            console.log('[LoginSuccess] 유저 정보 불러오기 성공:', userInfo);
          } catch (error) {
            console.error('[LoginSuccess] 유저 정보 불러오기 실패:', error);
            // 유저 정보 불러오기 실패해도 메인으로 이동 (나중에 다시 시도 가능)
          }
          
          // 3. 메인 페이지로 이동
          router.replace('/');
        } catch (error) {
          console.error('[LoginSuccess] 로그인 처리 실패:', error);
          router.replace('/');
        }
      } else {
        // accessToken이 없으면 메인으로 이동
        console.error('No accessToken in /login-success');
        router.replace('/');
      }
    };

    handleLoginSuccess();
  }, [searchParams, router, setAccessToken, setUser]);

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
