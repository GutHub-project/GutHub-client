/**
 * 공통 색상 정의 타입
 */
export declare const colors: {
  readonly main: "#FF7878";
  readonly sub: "#FFA4A4";
  readonly text: "#3C3F44";
  readonly white: "#FFFFFF";
  readonly "Black-100": "#FAFAFA";
  readonly "Black-200": "#F6F6F6";
  readonly "Black-300": "#EFEFEF";
  readonly "Black-400": "#DEDEDE";
  readonly "Black-500": "#C2C2C2";
  readonly "Black-600": "#979797";
  readonly "Black-700": "#818181";
  readonly "Black-800": "#494949";
  readonly Black: "#000000";
};

declare const config: {
  theme: {
    colors: typeof colors;
    extend: {
      keyframes: Record<string, Record<string, Record<string, string>>>;
      animation: Record<string, string>;
    };
  };
  plugins: never[];
};

export default config;

