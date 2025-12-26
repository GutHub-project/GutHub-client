import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import { useAuthStore } from '@repo/shared';
import { authApi } from '@repo/shared';

/**
 * 프로필 설정 페이지 (신규 회원)
 *
 * OAuth 인증 후 백엔드에서 이 페이지로 리다이렉트됩니다.
 * - 쿼리: tempToken
 * 프로필 완성 후 tempToken을 Bearer Token으로 담아서 회원가입 완료 API 호출
 * - 응답 쿼리: accessToken
 * - 응답 쿠키: refreshToken
 */
export default function ProfileSetup() {
  const params = useLocalSearchParams<{ tempToken?: string }>();
  const router = useRouter();
  const { setAccessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nickname: '',
    ageRange: '',
    gender: '',
    gutType: '',
  });

  useEffect(() => {
    if (!params.tempToken) {
      console.error('임시 토큰이 없습니다.');
      router.replace('/login');
      return;
    }
    setTempToken(params.tempToken);
  }, [params.tempToken, router]);

  const handleSubmit = async () => {
    if (!tempToken) {
      alert('인증 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);

      // 회원가입 완료 API 호출 (tempToken을 Authorization 헤더에 포함)
      const response = await authApi.completeSignup(formData, tempToken);

      // 액세스 토큰 저장 (리프레시 토큰은 쿠키에 저장됨)
      setAccessToken(response.accessToken);

      // TODO: 사용자 프로필 조회 API 호출
      // const profile = await userApi.getProfile();
      // setUser(profile);

      // 메인 화면으로 이동
      router.replace('/');
    } catch (error) {
      console.error('프로필 설정 중 오류:', error);
      alert('프로필 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.nickname.trim().length > 0;

  const ageOptions = ['10대', '20대', '30대', '40대'];
  const genderOptions = [
    { label: '남성', value: '남성' },
    { label: '여성', value: '여성' },
  ];
  const gutTypeOptions = [
    { label: '간강형', value: '간강형' },
    { label: '변비형', value: '변비형' },
    { label: '설사형', value: '설사형' },
    { label: '가스·복부팽만형', value: '가스·복부팽만형' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text weight="medium" style={styles.backButton}>
              ←
            </Text>
          </Pressable>
          <Text weight="semibold" style={styles.headerTitle}>
            프로필 설정
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 프로필 사진 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              {/* TODO: 이미지 선택 기능 구현 */}
            </View>
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraText}>📷</Text>
            </View>
          </View>
        </View>

        {/* 닉네임 */}
        <View style={styles.section}>
          <Text weight="semibold" style={styles.label}>
            닉네임
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="김허브 |"
              value={formData.nickname}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, nickname: text }))
              }
              placeholderTextColor={colors['Black-400']}
            />
            {formData.nickname.length > 0 && (
              <Pressable
                onPress={() => setFormData((prev) => ({ ...prev, nickname: '' }))}
              >
                <Text style={styles.clearButton}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* 연령대 */}
        <View style={styles.section}>
          <Text weight="semibold" style={styles.label}>
            연령대
          </Text>
          <View style={styles.optionRow}>
            {ageOptions.map((age) => (
              <Pressable
                key={age}
                style={[
                  styles.optionButton,
                  formData.ageRange === age && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData((prev) => ({ ...prev, ageRange: age }))}
              >
                <Text
                  weight="medium"
                  style={[
                    styles.optionText,
                    formData.ageRange === age && styles.optionTextSelected,
                  ]}
                >
                  {age}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 성별 */}
        <View style={styles.section}>
          <Text weight="semibold" style={styles.label}>
            성별
          </Text>
          <View style={styles.optionRow}>
            {genderOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.genderButton,
                  formData.gender === option.value && styles.genderButtonSelected,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, gender: option.value }))
                }
              >
                <Text
                  weight="medium"
                  style={[
                    styles.optionText,
                    formData.gender === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 장건강 유형 */}
        <View style={styles.section}>
          <Text weight="semibold" style={styles.label}>
            장건강 유형
          </Text>
          <View style={styles.optionRow}>
            {gutTypeOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.gutTypeButton,
                  formData.gutType === option.value && styles.gutTypeButtonSelected,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, gutType: option.value }))
                }
              >
                <Text
                  weight="medium"
                  style={[
                    styles.optionText,
                    formData.gutType === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 완료 버튼 */}
        <Pressable
          style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text weight="semibold" style={styles.submitButtonText}>
              완료
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors['Black-200'],
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors['Black-300'],
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  clearButton: {
    fontSize: 18,
    color: colors['Black-400'],
    paddingHorizontal: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors['Black-300'],
    backgroundColor: colors.white,
  },
  optionButtonSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors['Black-300'],
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
  },
  gutTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors['Black-300'],
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  gutTypeButtonSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors['Black-300'],
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors['Black-300'],
  },
  submitButtonText: {
    fontSize: 16,
    color: colors.white,
  },
});
