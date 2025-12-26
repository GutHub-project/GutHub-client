import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function WebViewContainer({ baseURL }: { baseURL: string }) {
  const router = useRouter();

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
      }
    } catch (err) {
      console.warn('Invalid message format', err);
    }
  };

  return (
    <WebView
      allowsBackForwardNavigationGestures={true}
      bounces={false}
      source={{ uri: baseURL }}
      onMessage={requestOnMessage}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert('메인 웹뷰 에러', `URL: ${nativeEvent.url}\n에러: ${nativeEvent.description}`);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert('메인 HTTP 에러', `상태 코드: ${nativeEvent.statusCode}`);
      }}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
