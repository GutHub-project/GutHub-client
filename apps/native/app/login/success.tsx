import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import { Text } from '@repo/shared';

/**
 * 소셜 로그인 성공 페이지 (기존 회원)
 *
 * OAuth 인증 후 백엔드에서 이 페이지로 리다이렉트됩니다.
 * - 쿼리: accessToken
 * - 쿠키: refreshToken
 *
 * 예: /login/success?accessToken=xxx
 */
export default function LoginSuccess() {
  const params = useLocalSearchParams<{ accessToken?: string }>();
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        const { accessToken } = params;

        if (!accessToken) {
          console.error('액세스 토큰이 없습니다.');
          router.replace('/login');
          return;
        }

        // 액세스 토큰 저장 (리프레시 토큰은 쿠키에 이미 저장됨)
        setAccessToken(accessToken);

        // TODO: 사용자 프로필 조회 API 호출
        // const profile = await userApi.getProfile();
        // setUser(profile);

        // 메인 화면으로 이동
        router.replace('/');
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        router.replace('/login');
      }
    };

    handleLoginSuccess();
  }, [params, router, setAccessToken]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.main} />
      <Text weight="medium" style={styles.text}>
        로그인 처리 중...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});
