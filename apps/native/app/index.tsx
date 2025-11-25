
import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";
import { View, StyleSheet, Alert } from "react-native";

import { LoginForm } from "../components/auth/LoginForm";

export default function Native() {

 
  const router = useRouter();

  const handleLogin = (credentials: { email: string; password: string }) => {
    // TODO: 실제 로그인 API 호출
    console.log("로그인 시도:", credentials);

    // 프로토타입용: 성공 시뮬레이션
    Alert.alert("로그인 성공", "로그인되었습니다.", [
      {
        text: "확인",
        onPress: () => {
          // TODO: 메인 화면으로 이동 (현재는 로그인 화면 유지)
          console.log("메인 화면으로 이동");
        },
      },
    ]);
  };

  const handleNavigateToSignup = () => {
    router.push("/(auth)/signup");
  };

  const handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    // TODO: 실제 SNS 로그인 연동
    console.log(`${provider} 로그인 시도`);

    // 프로토타입용: SNS 로그인 시뮬레이션
    Alert.alert(
      "SNS 로그인",
      `${provider}로 로그인을 진행합니다.\n\n(프로토타입: 실제 연동은 구현 필요)`,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "계속",
          onPress: () => {
            // 신규 회원인 경우 추가 정보 입력 화면으로
            router.push({
              pathname: "/(auth)/social-signup-additional",
              params: { provider },
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LoginForm
        onLogin={handleLogin}
        onNavigateToSignup={handleNavigateToSignup}
        onSocialLogin={handleSocialLogin}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});