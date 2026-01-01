import { QueryProvider, storage, useAuthStore } from '@repo/shared';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, setAccessToken } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const hasNavigated = useRef(false);

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

  // 스플래시 숨김 - isReady가 true가 되고 폰트 로딩이 완료되면 숨김
  useEffect(() => {
    if (isReady && (loaded || error)) {
      console.log('[_layout] Hiding splash screen');
      setTimeout(() => {
        SplashScreen.hideAsync().catch(err => {
          console.error('[_layout] Failed to hide splash:', err);
        });
      }, 300);
    }
  }, [isReady, loaded, error]);

  // 라우팅: Refresh Token 유무에 따라 / 또는 /login으로 이동 (초기 한 번만 실행)
  useEffect(() => {
    if (!isReady || hasNavigated.current) {
      console.log('[_layout] Not ready or already navigated, skipping routing');
      return;
    }

    const inAuthGroup = segments[0] === 'login';
    console.log('[_layout] Initial routing - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup);

    // 초기 네비게이션 수행 (한 번만)
    if (!isAuthenticated && !inAuthGroup) {
      console.log('[_layout] → Redirecting to /login');
      router.replace('/login');
      hasNavigated.current = true;
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[_layout] → Redirecting to /');
      router.replace('/');
      hasNavigated.current = true;
    } else {
      console.log('[_layout] → Already on correct route');
      hasNavigated.current = true;
    }
  }, [isReady, isAuthenticated, router, segments]);

  console.log('[_layout] Render - isReady:', isReady, 'loaded:', loaded, 'error:', !!error);

  // 항상 Stack을 렌더링 (스플래시는 useEffect에서 제어)
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
