import { useState } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';
import { colors } from '@repo/tailwind-config/colors';

interface SocialLoginWebViewProps {
  visible: boolean;
  loginUrl: string;
  onSuccess: (accessToken: string) => void;
  onSignupRequired: (tempToken: string) => void;
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
  onSignupRequired,
  onClose,
}: SocialLoginWebViewProps) => {
  const [loading, setLoading] = useState(true);

  /**
   * WebView 네비게이션 상태 변경 감지
   */
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    console.log('[SocialLoginWebView] Navigation URL:', url);

    // 기존 회원 - /login/success로 리다이렉트
    if (url.includes('/login/success')) {
      try {
        const urlObj = new URL(url);
        const accessToken = urlObj.searchParams.get('accessToken');

        if (accessToken) {
          console.log('[SocialLoginWebView] 로그인 성공');
          onSuccess(accessToken);
          onClose();
        }
      } catch (error) {
        console.error('[SocialLoginWebView] URL 파싱 실패:', error);
      }
    }
    // 신규 회원 - /profile-setup으로 리다이렉트
    else if (url.includes('/profile-setup')) {
      try {
        const urlObj = new URL(url);
        const tempToken = urlObj.searchParams.get('tempToken');

        if (tempToken) {
          console.log('[SocialLoginWebView] 회원가입 필요');
          onSignupRequired(tempToken);
          onClose();
        }
      } catch (error) {
        console.error('[SocialLoginWebView] URL 파싱 실패:', error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.main} />
          </View>
        )}
        <WebView
          source={{ uri: loginUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => {
            console.log('[SocialLoginWebView] Load Start:', loginUrl);
            setLoading(true);
          }}
          onLoadEnd={() => {
            console.log('[SocialLoginWebView] Load End');
            setLoading(false);
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});
