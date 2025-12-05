/**
 * ============================================================
 * 회원가입 1단계 - 아이디/비밀번호 설정
 * ============================================================
 *
 * [입력 항목]
 * - 아이디 (4~20자, 영문/숫자)
 * - 비밀번호 (8자 이상, 영문/숫자/특수문자 조합)
 * - 비밀번호 확인
 *
 * [다음 단계]
 * - signup-step2.tsx (닉네임, 이메일, 연령대)
 *
 * ============================================================
 */

import { useRouter } from "expo-router";
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

export default function SignupStep1() {
  const router = useRouter();

  // 입력 상태
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 비밀번호 표시 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 유효성 검사 상태
  const [userIdError, setUserIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);

  /**
   * 아이디 유효성 검사
   * - 4~20자
   * - 영문, 숫자만 허용
   */
  const validateUserId = (value: string): boolean => {
    if (value.length < 4) {
      setUserIdError("아이디는 4자 이상이어야 합니다.");
      return false;
    }
    if (value.length > 20) {
      setUserIdError("아이디는 20자 이하여야 합니다.");
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setUserIdError("아이디는 영문과 숫자만 사용 가능합니다.");
      return false;
    }
    setUserIdError(null);
    return true;
  };

  /**
   * 비밀번호 유효성 검사
   * - 8자 이상
   * - 영문, 숫자, 특수문자 조합
   */
  const validatePassword = (value: string): boolean => {
    if (value.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    // 영문, 숫자, 특수문자 각각 1개 이상 포함
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      setPasswordError("영문, 숫자, 특수문자를 모두 포함해야 합니다.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  /**
   * 비밀번호 확인 검사
   */
  const validatePasswordConfirm = (value: string): boolean => {
    if (value !== password) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setPasswordConfirmError(null);
    return true;
  };

  /**
   * 폼 유효성 검사
   */
  const isFormValid =
    userId.length >= 4 &&
    password.length >= 8 &&
    passwordConfirm === password &&
    !userIdError &&
    !passwordError &&
    !passwordConfirmError;

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    // 최종 유효성 검사
    const isUserIdValid = validateUserId(userId);
    const isPasswordValid = validatePassword(password);
    const isPasswordConfirmValid = validatePasswordConfirm(passwordConfirm);

    if (!isUserIdValid || !isPasswordValid || !isPasswordConfirmValid) {
      Alert.alert("입력 오류", "입력 정보를 확인해주세요.");
      return;
    }

    // TODO: 아이디 중복 검사 API 호출
    // const isDuplicate = await authService.checkUserIdDuplicate(userId);
    // if (isDuplicate) {
    //   setUserIdError("이미 사용 중인 아이디입니다.");
    //   return;
    // }

    // 2단계로 이동 (데이터 전달)
    router.push({
      pathname: "/signup-step2",
      params: {
        userId,
        password,
      },
    });
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
          <View style={styles.progressStepActive}>
            <Text style={styles.progressTextActive}>1</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <Text style={styles.progressText}>2</Text>
          </View>
        </View>
        <Text style={styles.stepTitle}>계정 정보 입력</Text>
        <Text style={styles.stepSubtitle}>로그인에 사용할 아이디와 비밀번호를 설정해주세요.</Text>

        {/* 아이디 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>아이디</Text>
          <View style={[styles.inputContainer, userIdError && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="영문, 숫자 4~20자"
              placeholderTextColor={colors["Black-600"]}
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                if (text.length > 0) validateUserId(text);
              }}
              onBlur={() => validateUserId(userId)}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
            {userId && (
              <TouchableOpacity onPress={() => setUserId("")} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {userIdError && <Text style={styles.errorText}>{userIdError}</Text>}
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="영문, 숫자, 특수문자 8자 이상"
              placeholderTextColor={colors["Black-600"]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.length > 0) validatePassword(text);
                if (passwordConfirm) validatePasswordConfirm(passwordConfirm);
              }}
              onBlur={() => validatePassword(password)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeButtonText}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View
            style={[styles.inputContainer, passwordConfirmError && styles.inputContainerError]}
          >
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor={colors["Black-600"]}
              value={passwordConfirm}
              onChangeText={(text) => {
                setPasswordConfirm(text);
                if (text.length > 0) validatePasswordConfirm(text);
              }}
              onBlur={() => validatePasswordConfirm(passwordConfirm)}
              secureTextEntry={!showPasswordConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeButtonText}>{showPasswordConfirm ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {passwordConfirmError && <Text style={styles.errorText}>{passwordConfirmError}</Text>}
        </View>

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
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
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors["Black-300"],
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
  progressText: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: colors["Black-600"],
  },
  progressTextActive: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: colors.white,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: colors["Black-300"],
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
  eyeButton: {
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: colors.main,
    marginTop: 4,
  },
  nextButton: {
    height: 52,
    backgroundColor: colors.main,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonDisabled: {
    backgroundColor: colors["Black-500"],
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: colors.white,
  },
});
