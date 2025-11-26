import { useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { SocialProvider } from "../types/auth";

export default function Native() {
  const router = useRouter();
  const { socialLogin, initializeAuth, isAuthenticated } = useAuth();

  const initialize = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile-setup");
    }
  }, [isAuthenticated, router]);

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      const mockProviderToken = `mock_${provider}_token_${Date.now()}`;
      await socialLogin(provider, mockProviderToken);
    } catch (error) {
      console.error("소셜 로그인 실패:", error);
    }
  };

  const handleBrowse = () => {
    console.log("둘러보기");
  };

  return (
    <View style={styles.container}>
      <LoginForm onSocialLogin={handleSocialLogin} onBrowse={handleBrowse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
