import { Text } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onKakaoPress: () => void;
  onNaverPress: () => void;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 * - Kakao, Google, Naver 로그인 버튼
 */
export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onKakaoPress,
  onNaverPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Kakao 로그인 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.kakaoButton,
          pressed && styles.pressed,
        ]}
        onPress={onKakaoPress}
      >
        {/* TODO: Kakao 아이콘 추가 */}
        <Text weight="semibold" style={styles.kakaoText}>
          💬 카카오 로그인
        </Text>
      </Pressable>

      {/* Naver 로그인 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.naverButton,
          pressed && styles.pressed,
        ]}
        onPress={onNaverPress}
      >
        <Text weight="semibold" style={styles.naverText}>
          네이버 로그인
        </Text>
      </Pressable>

      {/* Google 로그인 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.googleButton,
          pressed && styles.pressed,
        ]}
        onPress={onGooglePress}
      >
        {/* TODO: Google 아이콘 추가 */}
        <Text weight="semibold" style={styles.googleText}>
          구글 로그인
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.8,
  },

  // Kakao 버튼 스타일
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoText: {
    fontSize: 16,
    color: '#000000',
  },

  // Naver 버튼 스타일
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverText: {
    fontSize: 16,
    color: colors.white,
  },

  // Google 버튼 스타일
  googleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors['Black-300'],
  },
  googleText: {
    fontSize: 16,
    color: colors.text,
  },
});
