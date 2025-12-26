import { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
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

  // 디버깅 및 타임아웃 처리
  useEffect(() => {
    if (visible) {
      setLoading(true);
      console.log('[SocialLoginWebView] Opening with URL:', loginUrl);
      
      // URL이 이상하면 즉시 알림
      if (!loginUrl || loginUrl.includes('undefined')) {
        Alert.alert('URL 오류', `잘못된 주소입니다: ${loginUrl}`);
      }

      // 20초 후에도 로딩 중이면 타임아웃 알림
      const timer = setTimeout(() => {
        setLoading((prev) => {
          if (prev) {
            Alert.alert('로딩 지연', '서버 응답이 없습니다. 네트워크 상태나 서버 주소를 확인해주세요.');
            return false;
          }
          return false;
        });
      }, 20000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, loginUrl]);

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
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.main} />
            <Text style={styles.loadingText}>페이지를 불러오는 중...</Text>
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
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 40, // 상태바 고려
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.main,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
  },
  webview: {
    flex: 1,
  },
});
