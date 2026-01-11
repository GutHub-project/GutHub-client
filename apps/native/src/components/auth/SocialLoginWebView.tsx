import { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface SocialLoginWebViewProps {
  visible: boolean;
  loginUrl: string;
  onSuccess: (accessToken: string, refreshToken?: string) => void;
  onClose: () => void;
}

/**
 * 소셜 로그인 WebView 컴포넌트
 * - OAuth 로그인 페이지를 WebView로 표시
 * - 리다이렉트 URL을 감지하여 토큰 추출
 */
export const SocialLoginWebView = ({
  visible,
  loginUrl,
  onSuccess,
  onClose,
}: SocialLoginWebViewProps) => {
  const [initialLoading, setInitialLoading] = useState(true);

  // 디버깅 및 타임아웃 처리
  useEffect(() => {
    if (visible) {
      setInitialLoading(true);
      console.log('[SocialLoginWebView] Opening with URL:', loginUrl);
      
      // URL이 이상하면 즉시 알림
      if (!loginUrl || loginUrl.includes('undefined')) {
        Alert.alert('URL 오류', `잘못된 주소입니다: ${loginUrl}`);
      }

      // 20초 후에도 로딩 중이면 타임아웃 알림
      const timer = setTimeout(() => {
        setInitialLoading((prev) => {
          if (prev) {
            Alert.alert(
              '로딩 지연',
              `서버 응답이 없습니다.\n\n접속 시도 URL:\n${loginUrl}\n\n네트워크 상태나 서버 주소를 확인해주세요.`,
              [{ text: '확인', onPress: onClose }]
            );
            return false;
          }
          return false;
        });
      }, 20000);
      
      return () => clearTimeout(timer);
    } else {
      // Modal이 닫힐 때 초기화
      setInitialLoading(true);
    }
  }, [visible, loginUrl]);

  /**
   * WebView URL 로드 전 가로채기 (리다이렉트 URL 감지)
   * Android와 iOS 모두 지원
   */
  const handleUrlRedirect = (url: string): boolean => {
    console.log('[SocialLoginWebView] Intercepting URL:', url);

    // /login/success로 리다이렉트 시 토큰 추출 (WebView는 닫지 않고 계속 진행)
    if (url.includes('/login/success')) {
      try {
        const urlObj = new URL(url);
        const accessToken = urlObj.searchParams.get('accessToken');
        const refreshToken = urlObj.searchParams.get('refreshToken');

        if (accessToken) {
          console.log('[SocialLoginWebView] 로그인 성공, accessToken 저장:', accessToken);
          // 토큰만 저장하고 WebView는 닫지 않음 - 백엔드가 리다이렉트하는 대로 진행
          onSuccess(accessToken, refreshToken || undefined);
        }
      } catch (error) {
        console.error('[SocialLoginWebView] /login/success URL 파싱 실패:', error);
      }
    }

    return true; // 모든 URL 정상 로드
  };

  /**
   * iOS용 URL 가로채기
   */
  const handleShouldStartLoad = (request: { url: string }) => {
    return handleUrlRedirect(request.url);
  };

  /**
   * Android용 URL 가로채기
   */
  const handleNavigationStateChange = (navState: { url: string }) => {
    const shouldLoad = handleUrlRedirect(navState.url);
    if (!shouldLoad) {
      // Android에서는 로딩을 막을 수 없으므로, stopLoading 호출 필요
      // 하지만 여기서는 이미 onClose()가 호출되어 WebView가 사라짐
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {initialLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>로그인 페이지를 불러오는 중...</Text>
          </View>
        )}
        <WebView
          source={{ uri: loginUrl }}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={() => {
            console.log('[SocialLoginWebView] Initial load complete');
            // 초기 로딩만 한 번만 끝내기
            setInitialLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('[SocialLoginWebView] WebView Error: ', nativeEvent);
            Alert.alert(
              '웹뷰 로딩 에러',
              `URL: ${nativeEvent.url}\n에러: ${nativeEvent.description}\n코드: ${nativeEvent.code}`,
              [{ text: '확인', onPress: onClose }]
            );
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('[SocialLoginWebView] HTTP Error: ', nativeEvent);
            Alert.alert(
              '서버 응답 에러 (HTTP)',
              `상태 코드: ${nativeEvent.statusCode}\nURL: ${nativeEvent.url}`,
              [{ text: '확인', onPress: onClose }]
            );
          }}
          style={styles.webview}
          // 쿠키 활성화 (refreshToken 쿠키 수신)
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          // 구글 로그인 대응을 위한 userAgent 설정
          userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#333333',
  },
  webview: {
    flex: 1,
  },
});
