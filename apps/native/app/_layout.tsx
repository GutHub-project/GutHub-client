import { QueryProvider, useAuthStore, initializeAuth } from '@repo/shared';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

  const { isAuthenticated, login: setAuthState } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 초기 인증 정보 로드
  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsReady(true);
    };
    init();
  }, []);

  // 폰트 에러 처리
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 스플래시 숨김
  useEffect(() => {
    if (loaded && isReady) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [loaded, isReady]);

  // Deep Link 처리
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      const parsedUrl = Linking.parse(url);
      const { hostname, queryParams } = parsedUrl;

      // com.guthub://auth-callback?accessToken=xxx&refreshToken=xxx (기존 회원)
      if (hostname === 'auth-callback' && queryParams) {
        const accessToken = queryParams.accessToken as string | undefined;
        const refreshToken = queryParams.refreshToken as string | undefined;

        if (accessToken) {
          setAuthState({
            accessToken,
            ...(refreshToken && { refreshToken })
          });
          router.replace('/');
        }
      }
      // com.guthub://profile-setup?tempToken=xxx (신규 회원)
      else if (hostname === 'profile-setup' && queryParams) {
        const tempToken = queryParams.tempToken as string | undefined;

        if (tempToken) {
          router.push({
            pathname: '/profile-setup',
            params: { tempToken },
          });
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, setAuthState]);

  // 라우팅 로직
  useEffect(() => {
    if (!loaded || !isReady) {
      return;
    }

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, router, loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        />
      </QueryProvider>
    </SafeAreaProvider>
  );
};

export default AppLayout;
