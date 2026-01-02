import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SocialLoginWebView } from './SocialLoginWebView';

const BASE_URL = 'http://api.guthub.shop:8080';
const WEB_URL = 'https://guthub.shop';

export const SimpleLoginScreen = () => {
  const router = useRouter();
  const { setAccessToken } = useAuthStore();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const redirectUri = encodeURIComponent(`${WEB_URL}/login/success`);
    const url = `${BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${redirectUri}`;

    console.log(`[Login] Opening ${provider} login:`, url);
    setLoginUrl(url);
    setWebViewVisible(true);
  };

  const handleLoginSuccess = (accessToken: string, refreshToken?: string) => {
    console.log('[Login] Success! Got accessToken, 토큰 저장');
    // 토큰만 저장하고 라우팅하지 않음 - WebView가 계속 진행됨
    setAccessToken(accessToken);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: '/AppBar/logo.svg' }}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Image
              source={{ uri: '/AppBar/logo-name.svg' }}
              style={styles.logoName}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.description}>오직 내 만을 위한 장 건강 케어</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.helperText}>3초만에 준비하세요🔑</Text>

          {/* Google 로그인 */}
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={() => handleSocialLogin('google')}
          >
            <Text style={[styles.loginButtonText, styles.googleText]}>Google로 시작하기</Text>
          </TouchableOpacity>

          {/* Kakao 로그인 */}
          <TouchableOpacity
            style={[styles.loginButton, styles.kakaoButton]}
            onPress={() => handleSocialLogin('kakao')}
          >
            <Text style={[styles.loginButtonText, styles.kakaoText]}>Kakao로 시작하기</Text>
          </TouchableOpacity>

          {/* Naver 로그인 */}
          <TouchableOpacity
            style={[styles.loginButton, styles.naverButton]}
            onPress={() => handleSocialLogin('naver')}
          >
            <Text style={styles.loginButtonText}>Naver로 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 소셜 로그인 WebView */}
      <SocialLoginWebView
        visible={webViewVisible}
        loginUrl={loginUrl}
        onSuccess={handleLoginSuccess}
        onClose={() => setWebViewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  logoWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  logoName: {
    width: 120,
    height: 28,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  bottomSection: {
    gap: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleText: {
    color: '#000000',
  },
  kakaoButton: {
    backgroundColor: '#FFE812',
  },
  kakaoText: {
    color: '#000000',
  },
  naverButton: {
    backgroundColor: '#00C73C',
  },
});
