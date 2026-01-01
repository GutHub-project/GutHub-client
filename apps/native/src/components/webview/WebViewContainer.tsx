import { useRouter } from 'expo-router';
import { Alert, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useAuthStore } from '@repo/shared';
import { useState } from 'react';

export default function WebViewContainer({ baseURL }: { baseURL: string }) {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log('[WebViewContainer] Rendering with baseURL:', baseURL);

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

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>웹페이지를 불러올 수 없습니다</Text>
        <Text style={styles.errorSubText}>인터넷 연결을 확인해주세요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        allowsBackForwardNavigationGestures={true}
        bounces={false}
        source={{ uri: baseURL }}
        onMessage={requestOnMessage}
        onLoad={() => {
          console.log('[WebViewContainer] WebView loaded successfully');
          setIsLoading(false);
        }}
        onLoadStart={() => {
          console.log('[WebViewContainer] WebView load started');
          setIsLoading(true);
          setHasError(false);
        }}
        onLoadEnd={() => {
          console.log('[WebViewContainer] WebView load ended');
          setIsLoading(false);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('[WebViewContainer] WebView error:', nativeEvent);
          setHasError(true);
          setIsLoading(false);
          Alert.alert('웹뷰 로딩 에러', `URL: ${nativeEvent.url}\n에러: ${nativeEvent.description}`);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('[WebViewContainer] HTTP error:', nativeEvent.statusCode);
          setHasError(true);
          setIsLoading(false);
          Alert.alert('HTTP 에러', `상태 코드: ${nativeEvent.statusCode}\n페이지를 불러올 수 없습니다.`);
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJavaScript}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        )}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
  },
});

