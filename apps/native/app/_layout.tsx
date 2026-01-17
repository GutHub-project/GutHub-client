import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from '../src/utils/storage';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 저장된 토큰 확인 후 라우팅 결정
    const init = async () => {
      try {
        const refreshToken = await storage.getItem('refreshToken');
        
        // 스플래시 화면 숨기기
        await SplashScreen.hideAsync();
        
        // 토큰이 있으면 메인 웹뷰로, 없으면 로그인 화면으로
        if (refreshToken && segments.length === 0) {
          router.replace('/');
        } else if (!refreshToken && segments.length === 0) {
          router.replace('/login');
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('[AppLayout] 초기화 실패:', error);
        await SplashScreen.hideAsync();
        if (segments.length === 0) {
          router.replace('/login');
        }
        setIsReady(true);
      }
    };

    init();
  }, [segments, router]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      />
    </SafeAreaProvider>
  );
};

export default AppLayout;
