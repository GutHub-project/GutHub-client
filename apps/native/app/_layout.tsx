import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, initializeAuth } from '@repo/shared';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 앱 초기화 및 자동 로그인
    const init = async () => {
      await initializeAuth(); // 저장된 refresh token으로 자동 로그인
      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 1000);
    };

    init();
  }, []);

  // 라우팅 로직
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, router, isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default AppLayout;
