import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, useAuthStore } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import { authApi } from '@repo/main-feature/apis/auth';
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

  /**
   * 소셜 로그인 버튼 클릭 핸들러
   */
  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const url = authApi.getSocialLoginUrl(provider);
    console.log(`[LoginScreen] ${provider} 로그인 시도 URL:`, url);
    
    if (!url || url.startsWith('undefined') || url.startsWith('/')) {
      console.error('[LoginScreen] 유효하지 않은 로그인 URL입니다. BASE_URL 설정을 확인하세요.');
      // 폴백 URL 설정 (마지막 수단)
      const fallbackUrl = `https://api.guthub.shop/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent('com.guthub://auth-callback')}`;
      setLoginUrl(fallbackUrl);
    } else {
      setLoginUrl(url);
    }
    
    setWebViewVisible(true);
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
    handleSocialLogin('google');
  };

  const handleKakaoLogin = () => {
    handleSocialLogin('kakao');
  };

  const handleNaverLogin = () => {
    handleSocialLogin('naver');
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
