import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function WebViewContainer({ baseURL }: { baseURL: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                params: { ...data }
              });
            }
            break;
          case 'REPLACE':
            if (path) {
              router.replace({
                pathname: path,
                params: { ...data }
              });
            }
            break;
          case 'GO_BACK':
            router.back();
            break;
        }
      }
    } catch (err) {
      console.warn('Invalid message format', err);
    }
  };

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

  return (
    <>
      <WebView
        allowsBackForwardNavigationGestures={true}
        bounces={false}
        source={{ uri: baseURL }}
        onMessage={requestOnMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description);
          setLoading(false);
        }}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>페이지 로딩 중...</Text>
        </View>
      )}
    </>
  );
}

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