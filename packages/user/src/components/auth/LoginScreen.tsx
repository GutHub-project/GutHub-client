import { authApi } from '@repo/main-feature/apis/auth';
import { Text, useAuthStore, BASE_URL } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';

import { SocialLoginButtons } from './SocialLoginButtons';
import { SocialLoginWebView } from './SocialLoginWebView';

/**
 * 로그인 화면
 * - 소셜 로그인 버튼 (Google, Kakao, Naver)
 * - WebView를 통한 OAuth 로그인 처리
 * - 앱 로고 및 설명
 */
export const LoginScreen = () => {
  const router = useRouter();
  const { login: setAuthState } = useAuthStore();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');

  // 디버깅용: 현재 설정된 BASE_URL 확인
  useEffect(() => {
    console.log('[LoginScreen] Current BASE_URL:', BASE_URL);
    if (__DEV__) {
      // 개발 모드에서만 알림 (필요시 주석 해제)
      // Alert.alert('Debug', `BASE_URL: ${BASE_URL}`);
    }
  }, []);

  /**
   * 소셜 로그인 버튼 클릭 핸들러
   */
  const handleSocialLogin = () => {
    const url = authApi.getSocialLoginUrl();
    console.log(`[LoginScreen] 로그인 시도 URL:`, url);

    // 웹 환경에서는 직접 WEB_URL로 리다이렉트
    if (Platform.OS === 'web') {
      console.log('[LoginScreen] Web platform detected, redirecting to:', url);
      window.location.href = url;
      return;
    }

    // 네이티브 환경에서는 WebView 사용
    // 디버깅용: 생성된 URL 확인
    Alert.alert(
      '로그인 시도',
      `접속 주소: ${url}`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '접속',
          onPress: () => {
            if (!url || url.startsWith('undefined') || url.startsWith('/')) {
              console.error('[LoginScreen] 유효하지 않은 로그인 URL입니다. WEB_URL 설정을 확인하세요.');
              // 폴백 URL 설정 (마지막 수단)
              const fallbackUrl = 'https://guthub.shop';
              setLoginUrl(fallbackUrl);
            } else {
              setLoginUrl(url);
            }
            setWebViewVisible(true);
          }
        }
      ]
    );
  };

  /**
   * 로그인 성공 (기존 회원)
   * @param accessToken - 액세스 토큰
   */
  const handleLoginSuccess = (accessToken: string) => {
    console.log('[LoginScreen] 로그인 성공');
    setAuthState({ accessToken });
    router.replace('/');
  };

  /**
   * 회원가입 필요 (신규 회원)
   * @param tempToken - 임시 토큰
   */
  const handleSignupRequired = (tempToken: string) => {
    console.log('[LoginScreen] 회원가입 필요');
    router.push({
      pathname: '/profile-setup',
      params: { tempToken },
    });
  };

  const handleGoogleLogin = () => {
    handleSocialLogin();
  };

  const handleKakaoLogin = () => {
    handleSocialLogin();
  };

  const handleNaverLogin = () => {
    handleSocialLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          {/* TODO: 실제 앱 로고 이미지로 교체 */}
          <View style={styles.logoPlaceholder}>
            <Text weight="bold" style={styles.logoText}>
              GutHub
            </Text>
          </View>
          <Text weight="medium" style={styles.description}>
            오직 내 만을 위한 장 건강 케어
          </Text>
        </View>

        {/* 하단 영역 */}
        <View style={styles.bottomSection}>
          {/* 안내 문구 */}
          <Text weight="regular" style={styles.helperText}>
            3초만에 준비하세요🔑
          </Text>

          {/* 소셜 로그인 버튼 */}
          <View style={styles.loginContainer}>
            <SocialLoginButtons
              onGooglePress={handleGoogleLogin}
              onKakaoPress={handleKakaoLogin}
              onNaverPress={handleNaverLogin}
            />
          </View>
        </View>
      </View>

      {/* 소셜 로그인 WebView */}
      <SocialLoginWebView
        visible={webViewVisible}
        loginUrl={loginUrl}
        onSuccess={handleLoginSuccess}
        onSignupRequired={handleSignupRequired}
        onClose={() => setWebViewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    color: colors.white,
  },
  description: {
    fontSize: 14,
    color: colors['Black-600'],
    textAlign: 'center',
  },
  bottomSection: {
    gap: 16,
  },
  helperText: {
    fontSize: 14,
    color: colors['Black-600'],
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    gap: 12,
  },
});
