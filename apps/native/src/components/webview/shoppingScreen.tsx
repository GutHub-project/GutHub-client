import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WEBVIEW_PROPS } from '../../constants/webviewProps';
import { NavBar } from '../navBar/NavBar';

import WebViewContainer from './WebViewContainer';

export default function ShoppingScreen({ route }: { route: any }) {
  const { url } = route?.params ?? {};
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.webViewContainer}>
          <WebViewContainer baseURL={`${WEBVIEW_PROPS.BASE_URL}/shopping`} />
        </View>
      </SafeAreaView>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    paddingBottom: WEBVIEW_PROPS.BOTTOM_BAR_HEIGHT,
  },
});
