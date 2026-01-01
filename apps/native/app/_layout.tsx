import { QueryProvider, useAuthStore, initializeAuth } from '@repo/shared';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [showDebugAlert, setShowDebugAlert] = useState(false);

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

  console.log('[_layout] Font loading state - loaded:', loaded, 'error:', error);

  const { isAuthenticated, login: setAuthState } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 초기 인증 정보 로드
  useEffect(() => {
    const init = async () => {
      console.log('[_layout] Initializing auth...');
      await initializeAuth();
      console.log('[_layout] Auth initialized');
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (error) {
      console.error('[_layout] Font loading error:', error);
      // 폰트 로딩 에러 무시 (시스템 폰트 사용)
    }
  }, [error]);

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

  useEffect(() => {
    console.log('[_layout] Fonts loaded:', loaded, 'Ready:', isReady, 'Error:', error);
    // 폰트 로딩 완료 또는 에러 발생 시 스플래시 숨김
    if (loaded || error) {
      setTimeout(() => {
        console.log('[_layout] Hiding splash screen');
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [loaded, isReady, error]);

  useEffect(() => {
    // 폰트 로딩 실패해도 인증만 완료되면 진행
    const fontsReady = loaded || error;
    if (!fontsReady || !isReady) {
      console.log('[_layout] Waiting... fontsReady:', fontsReady, 'isReady:', isReady);
      return;
    }

    const inAuthGroup = segments[0] === 'login';
    console.log('[_layout] Routing check - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup, 'segments:', segments);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[_layout] Redirecting to /login');
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[_layout] Redirecting to /');
      router.replace('/');
    }
  }, [isAuthenticated, segments, router, loaded, error, isReady]);

  // 디버깅용 Alert - 한 번만 표시
  useEffect(() => {
    const fontsReady = loaded || error;
    if (!fontsReady || !isReady) {
      if (!showDebugAlert) {
        const timer = setTimeout(() => {
          Alert.alert(
            'Debug Info',
            `loaded: ${loaded}\nerror: ${error ? error.message : 'null'}\nfontsReady: ${fontsReady}\nisReady: ${isReady}`,
            [{ text: 'OK', onPress: () => setShowDebugAlert(true) }]
          );
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [loaded, error, isReady, showDebugAlert]);

  // 폰트 로딩 실패해도 인증만 완료되면 진행
  const fontsReady = loaded || error;
  if (!fontsReady || !isReady) {
    console.log('[_layout] Returning null - fontsReady:', fontsReady, 'isReady:', isReady);
    return null;
  }

  console.log('[_layout] Rendering Stack');

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
