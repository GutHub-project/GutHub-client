import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";

import WebViewContainer from "../components/webview/WebViewContainer";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl ?? "";

export default function Native() {
  return (
    <View style={styles.container}>
      <WebViewContainer baseURL={BASE_URL} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});