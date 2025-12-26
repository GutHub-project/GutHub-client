import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import { useSocialLogin } from '@repo/shared';
import { authApi } from '@repo/main-feature';
import { SocialLoginButtons } from './SocialLoginButtons';

/**
 * 로그인 화면
 * - 소셜 로그인 버튼 (Google, Kakao, Naver)
 * - 앱 로고 및 설명
 */
export const LoginScreen = () => {
  const { login, isLoading, error } = useSocialLogin(authApi);

  const handleGoogleLogin = async () => {
    try {
      // TODO: Google OAuth 플로우 구현
      // const { accessToken, idToken } = await GoogleSignIn.signIn();
      // await login('google', accessToken, idToken);
      console.log('Google 로그인 클릭');
    } catch (err) {
      console.error('Google 로그인 실패:', err);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      // TODO: Kakao OAuth 플로우 구현
      // const { accessToken } = await KakaoLogin.login();
      // await login('kakao', accessToken);
      console.log('Kakao 로그인 클릭');
    } catch (err) {
      console.error('Kakao 로그인 실패:', err);
    }
  };

  const handleNaverLogin = async () => {
    try {
      // TODO: Naver OAuth 플로우 구현
      // const { accessToken } = await NaverLogin.login();
      // await login('naver', accessToken);
      console.log('Naver 로그인 클릭');
    } catch (err) {
      console.error('Naver 로그인 실패:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          {/* TODO: 실제 앱 로고 이미지로 교체 */}
          <View style={styles.logoPlaceholder}>
            <Text weight="bold" style={styles.logoText}>
              GutHub
            </Text>
          </View>
          <Text weight="medium" style={styles.subtitle}>
            장 건강 관리 앱
          </Text>
        </View>

        {/* 소셜 로그인 버튼 영역 */}
        <View style={styles.loginContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.main} />
          ) : (
            <>
              <SocialLoginButtons
                onGooglePress={handleGoogleLogin}
                onKakaoPress={handleKakaoLogin}
                onNaverPress={handleNaverLogin}
              />
              {error && (
                <Text weight="regular" style={styles.errorText}>
                  {error}
                </Text>
              )}
            </>
          )}
        </View>

        {/* 하단 안내 문구 */}
        <View style={styles.footer}>
          <Text weight="regular" style={styles.footerText}>
            소셜 계정으로 간편하게 시작하세요
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
    paddingVertical: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    color: colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  loginContainer: {
    width: '100%',
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors['Black-600'],
  },
  errorText: {
    fontSize: 14,
    color: colors.main,
    textAlign: 'center',
    marginTop: 8,
  },
});
