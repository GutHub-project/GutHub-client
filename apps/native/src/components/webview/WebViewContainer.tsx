import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useAuthStore } from '@repo/shared';

export default function WebViewContainer({ baseURL }: { baseURL: string }) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const requestOnMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'ROUTER_EVENT') {
        const { method, path, data } = message;
        switch (method) {
          case 'PUSH':
            if (path) {
              router.push({
                pathname: path,
                params: { ...data },
              });
            }
            break;
          case 'REPLACE':
            if (path) {
              router.replace({
                pathname: path,
                params: { ...data },
              });
            }
            break;
          case 'GO_BACK':
            router.back();
            break;
        }
      }
    } catch (err) {
      console.warn('Invalid message format', err);
    }
  };

  // 웹뷰에 accessToken 주입
  const injectedJavaScript = `
    (function() {
      try {
        const accessToken = ${JSON.stringify(accessToken)};
        if (accessToken) {
          console.log('[WebView] Setting accessToken from native:', accessToken);
          localStorage.setItem('accessToken', accessToken);

          // 웹 앱에서 사용할 수 있도록 window 객체에도 설정
          window.__NATIVE_ACCESS_TOKEN__ = accessToken;
        } else {
          console.log('[WebView] No accessToken from native');
        }
      } catch (error) {
        console.error('[WebView] Error setting accessToken:', error);
      }
    })();
    true; // 반드시 true 반환
  `;

  return (
    <WebView
      allowsBackForwardNavigationGestures={true}
      bounces={false}
      source={{ uri: baseURL }}
      onMessage={requestOnMessage}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert('메인 웹뷰 에러', `URL: ${nativeEvent.url}\n에러: ${nativeEvent.description}`);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert('메인 HTTP 에러', `상태 코드: ${nativeEvent.statusCode}`);
      }}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      injectedJavaScript={injectedJavaScript}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
    />
  );
}
