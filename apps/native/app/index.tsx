import { View, StyleSheet } from 'react-native';
import WebViewScreen from '../src/components/webview/WebViewScreen';

export default function Native() {
  return (
    <View style={styles.container}>
      <WebViewScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

