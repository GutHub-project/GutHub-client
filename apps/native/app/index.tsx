import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SimpleNavBar } from '../src/components/navBar/SimpleNavBar';

const WEB_URL = 'https://guthub.shop';

export default function Home() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
      <SimpleNavBar />
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

