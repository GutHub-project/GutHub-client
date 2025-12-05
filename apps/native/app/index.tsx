/**
 * ============================================================
 * 로그인 화면 (index.tsx)
 * ============================================================
 *
 * 앱의 진입점 - 소셜 로그인 처리
 *
 * [OAuth2 소셜 로그인 플로우]
 *
 * 1단계: 사용자가 "Google/Kakao로 로그인" 버튼 클릭
 *   └─ handleSocialLogin() 호출
 *
 * 2단계: (TODO) OAuth2 인증 URL로 이동
 *   └─ 백엔드 /oauth2/authorization/{provider}
 *   └─ expo-web-browser 또는 expo-auth-session 사용
 *
 * 3단계: 백엔드가 소셜 인증 후 refreshToken 발급
 *   └─ SocialSuccessHandler가 쿠키에 refreshToken 담아 리디렉션
 *
 * 4단계: refreshToken으로 accessToken 발급
 *   └─ /jwt/refresh API 호출
 *
 * 5단계: 인증 완료 → 프로필 설정 화면으로 이동
 *
 * ============================================================
 */

import { useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { SocialProvider } from "../types/auth";

export default function Native() {
  const router = useRouter();
  const { socialLogin, initializeAuth, isAuthenticated } = useAuth();

  /**
   * 앱 시작 시 인증 상태 초기화
   * SecureStore에서 저장된 토큰을 불러옴
   */
  const initialize = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * 인증 상태 변경 감지
   * 로그인 성공 시 프로필 설정 화면으로 이동
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile-setup");
    }
  }, [isAuthenticated, router]);

  /**
   * ============================================================
   * 소셜 로그인 핸들러
   * ============================================================
   *
   * [현재 상태] Mock 데이터 사용 중 (백엔드 미완성)
   *
   * [TODO: 백엔드 완성 후 실제 구현]
   *
   * ```typescript
   * const handleSocialLogin = async (provider: SocialProvider) => {
   *   try {
   *     // 1. OAuth URL 생성 및 WebBrowser 열기
   *     const authUrl = authService.getOAuthURL(provider);
   *     const result = await WebBrowser.openAuthSessionAsync(
   *       authUrl,
   *       'guthub://login/success' // 딥링크 스킴
   *     );
   *
   *     // 2. 리디렉션 URL에서 refreshToken 추출
   *     if (result.type === 'success') {
   *       const refreshToken = extractRefreshToken(result.url);
   *
   *       // 3. accessToken 발급
   *       const { accessToken } = await authService.getAccessToken(refreshToken);
   *
   *       // 4. 토큰 저장
   *       await setAuth({ accessToken, refreshToken }, 'social', provider);
   *     }
   *   } catch (error) {
   *     console.error("소셜 로그인 실패:", error);
   *   }
   * };
   * ```
   *
   * @param provider - 소셜 로그인 제공자 ('google' | 'kakao')
   */
  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      // TODO: 백엔드 완성 후 실제 OAuth2 플로우로 교체
      // 현재는 Mock 토큰으로 테스트
      const mockProviderToken = `mock_${provider}_token_${Date.now()}`;
      await socialLogin(provider, mockProviderToken);
    } catch (error) {
      console.error("소셜 로그인 실패:", error);
    }
  };

  /**
   * 둘러보기 핸들러
   * 로그인 없이 앱 둘러보기 (제한된 기능)
   *
   * TODO: 비로그인 상태로 웹뷰 진입 로직 구현
   */
  const handleBrowse = () => {
    console.log("둘러보기");
    // TODO: 비로그인 상태로 메인 화면 이동
    // router.push("/main?guest=true");
  };

  /**
   * 회원가입 핸들러
   * 회원가입 1단계 페이지로 이동
   */
  const handleSignup = () => {
    router.push("/signup-step1");
  };

  return (
    <View style={styles.container}>
      <LoginForm
        onSocialLogin={handleSocialLogin}
        onBrowse={handleBrowse}
        onSignup={handleSignup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
