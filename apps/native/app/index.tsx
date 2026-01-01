import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleNavBar } from '../src/components/navBar/SimpleNavBar';

const WEB_URL = 'https://guthub.shop';

// 모바일 최적화를 위한 JavaScript 코드
const INJECTED_JAVASCRIPT = `
  (function() {
    // 모바일 viewport 설정
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);

    // 터치 액션 최적화
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.touchAction = 'manipulation';

    // 하단바 높이만큼 여백 추가 (Safe Area 포함하여 여유있게)
    document.body.style.paddingBottom = '100px';

    // 전체 화면 활성화
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'auto';

    // 확대/축소 방지
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    true;
  })();
`;

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
      <SimpleNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

