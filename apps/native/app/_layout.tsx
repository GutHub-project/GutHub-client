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

  // Refresh Token 체크 및 인증 상태 설정 (2초 타임아웃)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkRefreshToken = async () => {
      console.log('[_layout] Checking refresh token...');
      try {
        const refreshToken = await storage.getItem('refreshToken');
        if (refreshToken) {
          console.log('[_layout] Refresh Token found, setting authenticated');
          await setAccessToken('temp-token');
        } else {
          console.log('[_layout] No refresh token, staying unauthenticated');
        }
      } catch (error) {
        console.error('[_layout] Failed to check refresh token:', error);
      } finally {
        clearTimeout(timeoutId);
        console.log('[_layout] Setting isReady = true');
        setIsReady(true);
      }
    };

    // 2초 타임아웃: 체크가 너무 오래 걸리면 강제로 진행
    timeoutId = setTimeout(() => {
      console.warn('[_layout] Refresh token check timeout, forcing isReady = true');
      setIsReady(true);
    }, 2000);

    checkRefreshToken();

    return () => clearTimeout(timeoutId);
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
    if (!isReady) {
      console.log('[_layout] Not ready yet, skipping routing');
      return;
    }

    const inAuthGroup = segments[0] === 'login';
    console.log('[_layout] Routing - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup, 'segments:', segments);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[_layout] → Redirecting to /login');
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[_layout] → Redirecting to /');
      router.replace('/');
    } else {
      console.log('[_layout] → Staying on current route');
    }
  }, [isAuthenticated, segments, router, isReady]);

  console.log('[_layout] Render - isReady:', isReady);

  // isReady만 체크 (폰트는 선택사항)
  if (!isReady) {
    console.log('[_layout] ⚠️ Returning null (waiting for isReady)');
    return null;
  }

  console.log('[_layout] ✅ Rendering Stack');

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
