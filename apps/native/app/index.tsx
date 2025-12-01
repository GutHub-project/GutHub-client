import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WebViewScreen from '../src/components/webview/WebViewScreen';

export default function Native() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <WebViewScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
