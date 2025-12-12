/// <reference types="react-native" />

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }

  namespace ReactNative {
    interface WebView {
      postMessage: (message: string) => void;
    }
  }
}

export {};

