import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WEBVIEW_PROPS } from '../../constants/webviewProps';
import { NavBar } from '../navBar/NavBar';

import WebViewContainer from './WebViewContainer';

export default function WebViewScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const currentUrl = url ?? '';

  // 홈 화면인지 확인 (url이 없거나 빈 문자열이면 홈)
  const isHome = currentUrl === '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.webViewContainer}>
        <WebViewContainer baseURL={`${WEBVIEW_PROPS.BASE_URL}${currentUrl}`} />
      </View>
      {isHome && <NavBar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
  },
});
