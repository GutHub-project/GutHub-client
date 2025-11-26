# 로그인 시스템 가이드

네이티브 앱의 로그인 시스템과 토큰 관리에 대한 가이드입니다.

## 구조

### 1. 토큰 관리 시스템

#### 저장소 ([services/tokenStorage.ts](services/tokenStorage.ts))
- `expo-secure-store`를 사용하여 토큰을 안전하게 저장
- 일반 로그인과 소셜 로그인을 분기하여 관리
- 저장되는 정보:
  - `auth_tokens`: accessToken, refreshToken
  - `login_type`: 'email' 또는 'social'
  - `social_provider`: 'google', 'kakao', 'naver' (소셜 로그인 시에만)

#### 상태 관리 ([store/authStore.ts](store/authStore.ts))
- Zustand를 사용한 전역 인증 상태 관리
- 주요 기능:
  - `setAuth`: 토큰 저장 및 인증 상태 업데이트
  - `clearAuth`: 로그아웃 (토큰 삭제)
  - `loadAuth`: 앱 시작 시 저장된 토큰 불러오기
  - `updateAccessToken`: Access Token 갱신
  - `getAccessToken`: 현재 Access Token 가져오기

### 2. 로그인 플로우

#### 일반 로그인 (이메일/비밀번호)
```typescript
import { useAuth } from '../hooks/useAuth';

const { login } = useAuth();

// 로그인
const user = await login({ email: 'user@example.com', password: 'password123' });
```

#### 소셜 로그인
```typescript
import { useAuth } from '../hooks/useAuth';

const { socialLogin } = useAuth();

// 소셜 로그인 (Google, Kakao, Naver)
const user = await socialLogin('google', providerAccessToken);
```

### 3. 웹뷰 토큰 전달

#### 네이티브 → 웹뷰 메시지 전송

[components/webview/WebViewContainer.tsx](components/webview/WebViewContainer.tsx)에서:
1. 웹뷰 로드 완료 시 자동으로 토큰 전송
2. 웹뷰에서 요청 시 토큰 전송 (`REQUEST_AUTH` 메시지 수신)

```typescript
// 웹뷰로 전송되는 메시지 형식
{
  type: 'AUTH_DATA',
  payload: {
    accessToken: string,
    refreshToken: string,
    loginType: 'email' | 'social',
    socialProvider?: 'google' | 'kakao' | 'naver'
  }
}
```

#### 웹 앱에서 토큰 받기

웹 앱에서 다음과 같이 메시지를 수신할 수 있습니다:

```typescript
// 웹 앱 (React)에서
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === 'AUTH_DATA') {
        const { accessToken, refreshToken, loginType, socialProvider } = message.payload;
        // 토큰을 사용하여 인증 처리
        console.log('Received tokens from native app');
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  };

  window.addEventListener('message', handleMessage);
  document.addEventListener('message', handleMessage); // Android

  return () => {
    window.removeEventListener('message', handleMessage);
    document.removeEventListener('message', handleMessage);
  };
}, []);

// 네이티브 앱에 토큰 요청
const requestAuth = () => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'REQUEST_AUTH' })
    );
  }
};
```

### 4. 주요 파일 구조

```
apps/native/
├── types/
│   └── auth.ts                    # 인증 관련 타입 정의
├── services/
│   ├── tokenStorage.ts            # 토큰 저장소 (SecureStore)
│   └── authService.ts             # 로그인 API 서비스
├── store/
│   └── authStore.ts               # Zustand 인증 상태 관리
├── hooks/
│   └── useAuth.ts                 # 인증 훅
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx          # 로그인 UI
│   └── webview/
│       └── WebViewContainer.tsx   # 웹뷰 + 토큰 전달
└── utils/
    └── webViewBridge.ts           # 웹뷰 메시지 타입 정의
```

### 5. API 연동

현재는 Mock 데이터로 동작하지만, 실제 백엔드 연동 시 [services/authService.ts](services/authService.ts)를 수정하면 됩니다:

```typescript
// authService.ts 에서

// Mock 함수 대신 실제 API 호출 사용
export const authService = {
  async emailLogin(credentials: EmailLoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async socialLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/social-login', request);
    return response.data;
  },
};
```

### 6. 환경 변수 설정

`.env` 파일에 API URL을 설정하세요:

```env
EXPO_PUBLIC_API_URL=https://api.your-backend.com
```

## 사용 예시

### 로그인 화면에서 사용
```typescript
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { login, socialLogin, isLoading, error } = useAuth();

  const handleEmailLogin = async () => {
    try {
      await login({ email, password });
      // 로그인 성공 처리
    } catch (err) {
      // 에러 처리
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      // 1. 소셜 로그인 SDK에서 토큰 획득
      const providerToken = await getSocialProviderToken(provider);

      // 2. 백엔드에 토큰 전달하여 로그인
      await socialLogin(provider, providerToken);

      // 로그인 성공 처리
    } catch (err) {
      // 에러 처리
    }
  };
}
```

### 웹뷰에서 토큰 사용
```typescript
import WebViewContainer from '../components/webview/WebViewContainer';

export default function WebViewScreen() {
  // 자동으로 토큰이 웹뷰로 전달됨
  return <WebViewContainer baseURL="https://your-web-app.com" />;
}
```

## 주의사항

1. **토큰 보안**: `expo-secure-store`는 안전하게 토큰을 저장하지만, 루팅/탈옥된 기기에서는 보안이 약화될 수 있습니다.
2. **토큰 갱신**: Access Token 만료 시 Refresh Token을 사용하여 갱신해야 합니다.
3. **소셜 로그인**: 실제 소셜 로그인 구현 시 각 플랫폼의 SDK를 설치해야 합니다:
   - Google: `@react-native-google-signin/google-signin`
   - Kakao: `@react-native-seoul/kakao-login`
   - Naver: Naver SDK
