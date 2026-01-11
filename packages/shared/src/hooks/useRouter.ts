import { useRouter } from 'next/navigation';

// React Native WebView 타입 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const useAppRouter = () => {
  const router = useRouter();
  const isWebView = typeof window !== 'undefined' && !!window.ReactNativeWebView;

  const navigate = (
    method: 'push' | 'replace' | 'back' | 'forward',
    path?: string,
    screenName?: string,
    data?: Record<string, unknown>
  ) => {
    const nativeMethodMap = {
      push: 'PUSH',
      replace: 'REPLACE',
      back: 'GO_BACK',
      forward: 'GO_FORWARD',
    };

    if (isWebView) {
      return window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: 'ROUTER_EVENT',
          method: nativeMethodMap[method],
          path,
          screenName,
          data,
        })
      );
    } else {
      switch (method) {
        case 'push':
          if (!path) throw new Error('path 설정 오류');
          return router.push(path);
        case 'replace':
          if (!path) throw new Error('path 설정 오류');
          return router.replace(path);
        case 'back':
          return router.back();
        case 'forward':
          return router.forward?.();
      }
    }
  };

  return { navigate };
};

export default useAppRouter;