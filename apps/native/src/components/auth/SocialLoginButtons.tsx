import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@repo/shared';
import { colors } from '@repo/tailwind-config/colors';

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onKakaoPress: () => void;
  onNaverPress: () => void;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 * - Google, Kakao, Naver 로그인 버튼
 */
export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onKakaoPress,
  onNaverPress,
}) => {
  return (
    <View style={styles.container}>
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
        <View style={styles.iconPlaceholder} />
        <Text weight="semibold" style={styles.googleText}>
          Google로 계속하기
        </Text>
      </Pressable>

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
        <View style={styles.iconPlaceholder} />
        <Text weight="semibold" style={styles.kakaoText}>
          Kakao로 계속하기
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
        {/* TODO: Naver 아이콘 추가 */}
        <View style={styles.iconPlaceholder} />
        <Text weight="semibold" style={styles.naverText}>
          Naver로 계속하기
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
});
