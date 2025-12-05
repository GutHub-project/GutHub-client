import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { SocialProvider } from '../../types/auth';

interface LoginFormProps {
  onSocialLogin: (provider: SocialProvider) => void;
  onBrowse: () => void;
  onSignup: () => void;
}

export const LoginForm = ({ onSocialLogin, onBrowse, onSignup }: LoginFormProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.browseButton} onPress={onBrowse}>
        <Text style={styles.browseText}>둘러보기</Text>
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.logoText}>
          Gut<Text style={styles.logoHighlight}>h</Text>ub
        </Text>

        <Text style={styles.subtitle}>오직 &quot;나&quot;만을 위한 장 건강 케어</Text>

        <View style={styles.checkupContainer}>
          <Text style={styles.checkupText}>3초만에 장검사하기🥕</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.socialButton, styles.kakaoButton]}
          onPress={() => onSocialLogin('kakao')}
        >
          <Text style={styles.kakaoButtonText}>💬 카카오 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => onSocialLogin('google')}
        >
          <Text style={styles.googleButtonText}>G 구글 로그인</Text>
        </TouchableOpacity>

        {/* 회원가입 링크 */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>아직 회원이 아니신가요?</Text>
          <TouchableOpacity onPress={onSignup}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  browseButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  browseText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#EE8688',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#EE8688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: 48,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginBottom: 12,
  },
  logoHighlight: {
    color: '#EE8688',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
    marginBottom: 40,
  },
  checkupContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkupText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  bottomContainer: {
    gap: 12,
  },
  socialButton: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#EE8688',
  },
});
