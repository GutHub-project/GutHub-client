import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SimpleNavBar } from '../src/components/navBar/SimpleNavBar';
import { useRef } from 'react';

const WEB_URL = 'https://guthub.shop';

export default function Home() {
  const webViewRef = useRef<WebView>(null);

  const handleNavigate = (path: string) => {
    const url = `${WEB_URL}${path}`;
    console.log('[Home] Navigating to:', url);
    webViewRef.current?.injectJavaScript(`window.location.href = '${url}'; true;`);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
      <SimpleNavBar onNavigate={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});

