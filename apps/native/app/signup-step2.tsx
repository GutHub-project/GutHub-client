/**
 * ============================================================
 * 회원가입 2단계 - 프로필 정보 입력
 * ============================================================
 *
 * [입력 항목]
 * - 닉네임 (2~10자)
 * - 이메일 주소
 * - 연령대 선택
 *
 * [이전 단계에서 전달받은 데이터]
 * - userId, password (signup-step1에서)
 *
 * [완료 시]
 * - 회원가입 API 호출
 * - 성공 시 로그인 화면으로 이동
 *
 * ============================================================
 */

import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "@repo/tailwind-config";

import type { AgeGroup } from "../types/profile";

export default function SignupStep2() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId: string; password: string }>();

  // 이전 단계에서 전달받은 데이터
  const { userId, password } = params;

  // 입력 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);

  // 유효성 검사 상태
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // 연령대 옵션
  const ageGroups: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];

  /**
   * 닉네임 유효성 검사
   * - 2~10자
   */
  const validateNickname = (value: string): boolean => {
    if (value.length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다.");
      return false;
    }
    if (value.length > 10) {
      setNicknameError("닉네임은 10자 이하여야 합니다.");
      return false;
    }
    setNicknameError(null);
    return true;
  };

  /**
   * 이메일 유효성 검사
   */
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  /**
   * 폼 유효성 검사
   */
  const isFormValid =
    nickname.length >= 2 &&
    email.length > 0 &&
    ageGroup !== null &&
    !nicknameError &&
    !emailError;

  /**
   * 회원가입 완료
   */
  const handleComplete = async () => {
    // 최종 유효성 검사
    const isNicknameValid = validateNickname(nickname);
    const isEmailValid = validateEmail(email);

    if (!isNicknameValid || !isEmailValid || !ageGroup) {
      Alert.alert("입력 오류", "모든 정보를 올바르게 입력해주세요.");
      return;
    }

    // 회원가입 데이터 구성
    const signupData = {
      userId,
      password,
      nickname,
      email,
      ageGroup,
    };

    console.log("회원가입 데이터:", signupData);

    // TODO: 백엔드 회원가입 API 호출
    // try {
    //   const response = await authService.signup(signupData);
    //   if (response.success) {
    //     Alert.alert("회원가입 완료", "로그인 화면으로 이동합니다.", [
    //       { text: "확인", onPress: () => router.replace("/") }
    //     ]);
    //   }
    // } catch (error) {
    //   Alert.alert("회원가입 실패", error.message);
    // }

    // Mock: 회원가입 성공 처리
    Alert.alert("회원가입 완료", "환영합니다! 로그인 화면으로 이동합니다.", [
      {
        text: "확인",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* 진행 상태 표시 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStepCompleted}>
            <Text style={styles.progressTextCompleted}>✓</Text>
          </View>
          <View style={styles.progressLineActive} />
          <View style={styles.progressStepActive}>
            <Text style={styles.progressTextActive}>2</Text>
          </View>
        </View>
        <Text style={styles.stepTitle}>프로필 정보 입력</Text>
        <Text style={styles.stepSubtitle}>서비스 이용에 필요한 정보를 입력해주세요.</Text>

        {/* 닉네임 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>닉네임</Text>
          <View style={[styles.inputContainer, nicknameError && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="2~10자 입력"
              placeholderTextColor={colors["Black-600"]}
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                if (text.length > 0) validateNickname(text);
              }}
              onBlur={() => validateNickname(nickname)}
              maxLength={10}
            />
            {nickname && (
              <TouchableOpacity onPress={() => setNickname("")} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {nicknameError && <Text style={styles.errorText}>{nicknameError}</Text>}
        </View>

        {/* 이메일 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>이메일 주소</Text>
          <View style={[styles.inputContainer, emailError && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={colors["Black-600"]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text.length > 0) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {email && (
              <TouchableOpacity onPress={() => setEmail("")} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        {/* 연령대 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>연령대</Text>
          <View style={styles.optionsRow}>
            {ageGroups.map((age) => (
              <TouchableOpacity
                key={age}
                style={[styles.optionButton, ageGroup === age && styles.optionButtonSelected]}
                onPress={() => setAgeGroup(age)}
              >
                <Text style={[styles.optionText, ageGroup === age && styles.optionTextSelected]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 완료 버튼 */}
        <TouchableOpacity
          style={[styles.completeButton, !isFormValid && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={styles.completeButtonText}>가입 완료</Text>
        </TouchableOpacity>

        {/* 약관 안내 */}
        <Text style={styles.termsText}>
          가입 완료 시{" "}
          <Text style={styles.termsLink}>서비스 이용약관</Text> 및{" "}
          <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의하게 됩니다.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors["Black-300"],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  progressStepCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.main,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTextCompleted: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: colors.white,
  },
  progressTextActive: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: colors.white,
  },
  progressLineActive: {
    width: 40,
    height: 2,
    backgroundColor: "#4CAF50",
    marginHorizontal: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: colors["Black-700"],
    textAlign: "center",
    marginBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors["Black-400"],
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: colors["Black-100"],
  },
  inputContainerError: {
    borderColor: colors.main,
    backgroundColor: colors["Black-100"],
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 24,
    color: colors["Black-600"],
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: colors.main,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors["Black-400"],
    backgroundColor: colors.white,
  },
  optionButtonSelected: {
    backgroundColor: colors.sub,
    borderColor: colors.main,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: colors["Black-700"],
  },
  optionTextSelected: {
    color: colors.main,
    fontFamily: "Pretendard-SemiBold",
  },
  completeButton: {
    height: 52,
    backgroundColor: colors.main,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonDisabled: {
    backgroundColor: colors["Black-500"],
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: colors.white,
  },
  termsText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: colors["Black-600"],
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.main,
    textDecorationLine: "underline",
  },
});
