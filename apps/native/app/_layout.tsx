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
      try {
        console.log('[_layout] Starting initializeAuth...');
        // 5초 타임아웃 추가
        await Promise.race([
          initializeAuth(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth timeout')), 5000)
          )
        ]);
        console.log('[_layout] Auth initialized successfully');
      } catch (err) {
        console.error('[_layout] Auth init error:', err);
      } finally {
        // 성공/실패 관계없이 진행
        console.log('[_layout] Setting isReady to true');
        setIsReady(true);
      }
    };
    init();
  }, []);

  // Deep Link 처리
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('[Deep Link] Received URL:', url);

      const parsedUrl = Linking.parse(url);
      const { hostname, queryParams } = parsedUrl;

      // com.guthub://auth-callback?accessToken=xxx&refreshToken=xxx (기존 회원)
      if (hostname === 'auth-callback' && queryParams) {
        const accessToken = queryParams.accessToken as string | undefined;
        const refreshToken = queryParams.refreshToken as string | undefined;

        if (accessToken) {
          console.log('[Deep Link] 로그인 성공');
          setAuthState({ accessToken, refreshToken });
          router.replace('/');
        }
      }
      // com.guthub://profile-setup?tempToken=xxx (신규 회원)
      else if (hostname === 'profile-setup' && queryParams) {
        const tempToken = queryParams.tempToken as string | undefined;

        if (tempToken) {
          console.log('[Deep Link] 회원가입 필요');
          router.push({
            pathname: '/profile-setup',
            params: { tempToken },
          });
        }
      }
    };

    // 앱이 백그라운드에서 열린 경우
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // 앱이 종료 상태에서 열린 경우
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, setAuthState]);

  // 스플래시 숨기기 - 폰트와 인증 모두 준비되면
  useEffect(() => {
    if ((loaded || error) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isReady]);

  // 라우팅 처리
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';
    console.log('[_layout] Routing - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup, 'segments:', segments);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[_layout] Redirecting to /login');
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[_layout] Redirecting to /');
      router.replace('/');
    }
  }, [isAuthenticated, segments, isReady]);

  // 준비 안 되면 null 반환 (스플래시 계속 표시)
  if (!isReady || (!loaded && !error)) {
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
