import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { Logo } from '../Logo';
import { LogoName } from '../LogoName';
import { storage } from '../../utils/storage';
import { setAccessToken } from '../../apis/instance';
import { userApi } from '../../apis/user';

const BASE_URL = 'http://api.guthub.shop:8080';
const WEB_URL = 'https://guthub.shop';

export const SimpleLoginScreen = () => {
  const router = useRouter();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const insets = useSafeAreaInsets();

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const redirectUri = encodeURIComponent(`${WEB_URL}/login/success`);
    const url = `${BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${redirectUri}`;
    
    console.log(`[Login] Opening ${provider} login:`, url);
    setLoginUrl(url);
    setWebViewVisible(true);
  };

  const handleLoginSuccess = async (accessToken: string, refreshToken?: string) => {
    try {
      console.log('[Login] Success! 토큰 저장');
      
      // 1. Access Token 저장 (메모리)
      setAccessToken(accessToken);
      
      // 2. Refresh Token 저장 (네이티브 저장소)
      if (refreshToken) {
        await storage.setItem('refreshToken', refreshToken);
      }
      
      // 3. 유저 정보 불러오기 (API 호출로 토큰 검증 및 유저 정보 로드)
      try {
        const userInfo = await userApi.getProfile();
        console.log('[SimpleLoginScreen] 유저 정보 불러오기 성공:', userInfo);
      } catch (error) {
        console.error('[SimpleLoginScreen] 유저 정보 불러오기 실패:', error);
        // 유저 정보 불러오기 실패해도 메인으로 이동 (웹뷰에서 다시 시도 가능)
      }
      
      // 4. 웹뷰 메인 화면으로 이동
      setWebViewVisible(false);
      router.replace('/');
    } catch (error) {
      console.error('[SimpleLoginScreen] 로그인 처리 실패:', error);
    }
  };

  const handleUrlChange = (url: string) => {
    // 로그인 성공 URL 감지
    if (url.includes('/login/success')) {
      try {
        const urlObj = new URL(url);
        const accessToken = urlObj.searchParams.get('accessToken');
        const refreshToken = urlObj.searchParams.get('refreshToken');
        
        if (accessToken) {
          handleLoginSuccess(accessToken, refreshToken || undefined);
        }
      } catch (error) {
        console.error('[SimpleLoginScreen] URL 파싱 실패:', error);
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.content, { paddingTop: Math.max(insets.top, 40), paddingBottom: Math.max(insets.bottom, 40) }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Logo width={60} height={60} />
              <LogoName width={120} height={28} />
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
      </SafeAreaView>

      {/* 소셜 로그인 WebView */}
      <Modal
        visible={webViewVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setWebViewVisible(false)}
      >
        <SafeAreaView style={styles.webViewContainer} edges={['top', 'bottom']}>
          <WebView
            source={{ uri: loginUrl }}
            onNavigationStateChange={(navState) => {
              handleUrlChange(navState.url);
            }}
            onShouldStartLoadWithRequest={(request) => {
              handleUrlChange(request.url);
              return true;
            }}
            style={styles.webview}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
          />
        </SafeAreaView>
      </Modal>
    </>
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
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
