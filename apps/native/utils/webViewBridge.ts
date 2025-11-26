export interface WebViewAuthMessage {
  type: 'AUTH_DATA';
  payload: {
    accessToken: string;
    refreshToken: string;
    loginType: 'email' | 'social';
    socialProvider?: 'google' | 'kakao' | 'naver';
  };
}

export interface WebViewRouterMessage {
  type: 'ROUTER_EVENT';
  method: 'PUSH' | 'REPLACE' | 'GO_BACK';
  path?: string;
  data?: Record<string, unknown>;
}

export interface WebViewRequestAuthMessage {
  type: 'REQUEST_AUTH';
}

export type WebViewMessage = WebViewAuthMessage | WebViewRouterMessage | WebViewRequestAuthMessage;
