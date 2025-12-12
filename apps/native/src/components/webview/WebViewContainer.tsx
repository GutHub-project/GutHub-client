<<<<<<< HEAD:apps/native/components/webview/WebViewContainer.tsx
/**
 * ============================================================
 * 웹뷰 컨테이너 (WebViewContainer)
 * ============================================================
 *
 * 네이티브 앱 내에서 Next.js 웹앱을 표시하는 컴포넌트
 *
 * [핵심 기능]
 * 1. 웹뷰 로드 및 에러 처리
 * 2. 네이티브 → 웹뷰 인증 데이터 전달 (postMessage)
 * 3. 웹뷰 → 네이티브 이벤트 처리 (onMessage)
 *
 * [통신 프로토콜]
 *
 * 네이티브 → 웹뷰:
 * - AUTH_DATA: 인증 토큰 전달 (accessToken, refreshToken)
 *
 * 웹뷰 → 네이티브:
 * - ROUTER_EVENT: 라우팅 요청 (PUSH, REPLACE, GO_BACK)
 * - REQUEST_AUTH: 인증 데이터 요청
 *
 * ============================================================
 */

import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
=======
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
>>>>>>> upstream/develop:apps/native/src/components/webview/WebViewContainer.tsx

import { useAuthStore } from "../../store/authStore";

interface WebViewContainerProps {
  /** 웹뷰에 로드할 URL (Next.js 웹앱 주소) */
  baseURL: string;
}

export default function WebViewContainer({ baseURL }: WebViewContainerProps) {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zustand store에서 인증 정보 가져오기
  const { tokens, loginType, socialProvider } = useAuthStore();

  /**
   * ============================================================
   * 웹뷰 → 네이티브 메시지 핸들러
   * ============================================================
   *
   * 웹뷰에서 window.ReactNativeWebView.postMessage()로 보낸
   * 메시지를 처리
   *
   * [메시지 타입]
   *
   * 1. ROUTER_EVENT - 네이티브 라우팅 요청
   *    - PUSH: 새 화면으로 이동
   *    - REPLACE: 현재 화면 교체
   *    - GO_BACK: 뒤로가기
   *
   * 2. REQUEST_AUTH - 인증 데이터 요청
   *    - 웹뷰가 인증 정보 필요 시 호출
   *    - 응답으로 AUTH_DATA 메시지 전송
   */
  const requestOnMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'ROUTER_EVENT') {
        const { method, path, data } = message;
        switch (method) {
          case 'PUSH':
            if (path) {
              router.push({
                pathname: path,
                params: { ...data },
              });
            }
            break;
          case 'REPLACE':
            if (path) {
              router.replace({
                pathname: path,
                params: { ...data },
              });
            }
            break;
          case 'GO_BACK':
            router.back();
            break;
        }
      } else if (message.type === 'REQUEST_AUTH') {
        // 웹뷰가 인증 데이터 요청 시 전송
        sendAuthToWebView();
      }
    } catch (err) {
      console.warn('Invalid message format', err);
    }
  };

  /**
   * ============================================================
   * 네이티브 → 웹뷰 인증 데이터 전송
   * ============================================================
   *
   * OAuth2 로그인 후 발급받은 토큰을 웹뷰에 전달
   *
   * [전송 데이터]
   * - accessToken: API 요청용 토큰
   * - refreshToken: 토큰 갱신용
   * - loginType: 'email' | 'social'
   * - socialProvider: 'google' | 'kakao' | 'naver'
   *
   * [웹뷰에서 수신 방법]
   * ```javascript
   * window.addEventListener('message', (event) => {
   *   const data = JSON.parse(event.data);
   *   if (data.type === 'AUTH_DATA') {
   *     const { accessToken, refreshToken } = data.payload;
   *     // 토큰 저장 및 API 요청에 사용
   *   }
   * });
   * ```
   */
  const sendAuthToWebView = () => {
    if (!webViewRef.current || !tokens) return;

    const authData = {
      type: 'AUTH_DATA',
      payload: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        loginType,
        socialProvider,
      },
    };

    webViewRef.current.postMessage(JSON.stringify(authData));
  };

  /**
   * 웹뷰 로드 완료 핸들러
   * 로드 완료 후 인증 데이터 자동 전송
   */
  const handleLoadEnd = () => {
    setLoading(false);
    // 로그인 상태면 인증 데이터 전송
    if (tokens) {
      // 웹뷰 JavaScript 실행 대기를 위한 딜레이
      setTimeout(() => {
        sendAuthToWebView();
      }, 100);
    }
  };

  // ============================================================
  // 에러 상태 렌더링
  // ============================================================

  if (!baseURL) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>BASE_URL이 설정되지 않았습니다.</Text>
        <Text style={styles.subText}>app.json의 extra.baseUrl을 확인하세요.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>웹 페이지를 불러올 수 없습니다</Text>
        <Text style={styles.subText}>{error}</Text>
        <Text style={styles.urlText}>URL: {baseURL}</Text>
      </View>
    );
  }

  // ============================================================
  // 메인 렌더링
  // ============================================================

  return (
    <>
      <WebView
        ref={webViewRef}
        // 뒤로가기 스와이프 제스처 활성화
        allowsBackForwardNavigationGestures={true}
        // 스크롤 바운스 비활성화 (네이티브 앱 느낌)
        bounces={false}
        // 웹뷰에 로드할 URL
        source={{ uri: baseURL }}
        // 웹뷰 → 네이티브 메시지 핸들러
        onMessage={requestOnMessage}
        // 로딩 상태 관리
        onLoadStart={() => setLoading(true)}
        onLoadEnd={handleLoadEnd}
        // 에러 핸들링
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description);
          setLoading(false);
        }}
      />
      {/* 로딩 오버레이 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>페이지 로딩 중...</Text>
        </View>
      )}
    </>
  );
}
<<<<<<< HEAD:apps/native/components/webview/WebViewContainer.tsx

// ============================================================
// 스타일
// ============================================================

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  urlText: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
    fontFamily: "monospace",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});
=======
>>>>>>> upstream/develop:apps/native/src/components/webview/WebViewContainer.tsx
