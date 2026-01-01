import { useRef, useEffect, useState } from 'react';
import { StyleSheet, BackHandler, ToastAndroid, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEB_URL = 'https://guthub.shop';

// 모바일 최적화를 위한 JavaScript 코드
const INJECTED_JAVASCRIPT = `
  (function() {
    // 모바일 viewport 설정
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);

    // 터치 액션 최적화
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.touchAction = 'manipulation';

    // 전체 화면 활성화
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'auto';

    // 확대/축소 방지
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    true;
  })();
`;

export default function Home() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [exitApp, setExitApp] = useState(false);
  const exitTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        // WebView에서 뒤로 갈 수 있으면 뒤로 가기
        webViewRef.current.goBack();
        return true;
      } else {
        // 뒤로 갈 수 없으면 앱 종료 로직
        if (exitApp) {
          // 두 번째 뒤로가기: 앱 종료
          BackHandler.exitApp();
          return true;
        } else {
          // 첫 번째 뒤로가기: 토스트 메시지
          setExitApp(true);
          if (Platform.OS === 'android') {
            ToastAndroid.show('한 번 더 누르면 종료됩니다', ToastAndroid.SHORT);
          }

          // 2초 후 exitApp 상태 리셋
          if (exitTimeout.current) {
            clearTimeout(exitTimeout.current);
          }
          exitTimeout.current = setTimeout(() => {
            setExitApp(false);
          }, 2000);

          return true;
        }
      }
    });

    return () => {
      backHandler.remove();
      if (exitTimeout.current) {
        clearTimeout(exitTimeout.current);
      }
    };
  }, [canGoBack, exitApp]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

