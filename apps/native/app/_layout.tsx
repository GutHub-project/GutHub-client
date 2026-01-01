import { QueryProvider, storage } from '@repo/shared';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);

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

  // Refresh Token 체크
  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const refreshToken = await storage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Refresh Token found');
        }
      } catch (error) {
        console.error('Failed to check refresh token:', error);
      } finally {
        setIsReady(true);
      }
    };
    checkRefreshToken();
  }, []);

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
