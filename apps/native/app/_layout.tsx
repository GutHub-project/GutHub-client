import { QueryProvider, storage, useAuthStore } from '@repo/shared';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, setAccessToken } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  const [loaded, error] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-Thin': require('../assets/fonts/Pretendard-Thin.ttf'),
    'Pretendard-ExtraLight': require('../assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretendard-Light': require('../assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-ExtraBold': require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    'Pretendard-Black': require('../assets/fonts/Pretendard-Black.ttf'),
  });

  // Refresh Token 체크 및 인증 상태 설정
  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const refreshToken = await storage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Refresh Token found, setting authenticated');
          // Refresh Token이 있으면 임시로 인증된 상태로 설정
          // TODO: 실제로는 Refresh Token으로 Access Token 갱신 API 호출
          await setAccessToken('temp-token');
        }
      } catch (error) {
        console.error('Failed to check refresh token:', error);
      } finally {
        setIsReady(true);
      }
    };
    checkRefreshToken();
  }, [setAccessToken]);

  // 폰트 에러 무시
  useEffect(() => {
    if (error) {
      console.error('Font loading error (ignored):', error);
    }
  }, [error]);

  // 스플래시 숨김 - 폰트 로딩 완료 또는 에러 발생 시
  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [loaded, error]);

  // 라우팅: Refresh Token 유무에 따라 / 또는 /login으로 이동
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // 인증 안됨 + 로그인 화면 아님 → 로그인으로
      console.log('Not authenticated, redirecting to /login');
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // 인증됨 + 로그인 화면 → 홈으로
      console.log('Authenticated, redirecting to /');
      router.replace('/');
    }
  }, [isAuthenticated, segments, router, isReady]);

  // isReady만 체크 (폰트는 선택사항)
  if (!isReady) {
    return null;
  }

  return (
    <QueryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      />
    </QueryProvider>
  );
};

export default AppLayout;
