import { Text as DefaultText, TextProps as RNTextProps, Platform } from "react-native";

export interface TextProps extends RNTextProps {
  weight?: "thin" | "extralight" | "light" | "regular" | "medium" | "semibold" | "bold" | "extrabold" | "black";
}

const fontFamilyMap = {
  thin: Platform.select({
    ios: "Pretendard-Thin",
    android: "Pretendard-Thin",
    web: undefined,
  }),
  extralight: Platform.select({
    ios: "Pretendard-ExtraLight",
    android: "Pretendard-ExtraLight",
    web: undefined,
  }),
  light: Platform.select({
    ios: "Pretendard-Light",
    android: "Pretendard-Light",
    web: undefined,
  }),
  regular: Platform.select({
    ios: "Pretendard-Regular",
    android: "Pretendard-Regular",
    web: undefined,
  }),
  medium: Platform.select({
    ios: "Pretendard-Medium",
    android: "Pretendard-Medium",
    web: undefined,
  }),
  semibold: Platform.select({
    ios: "Pretendard-SemiBold",
    android: "Pretendard-SemiBold",
    web: undefined,
  }),
  bold: Platform.select({
    ios: "Pretendard-Bold",
    android: "Pretendard-Bold",
    web: undefined,
  }),
  extrabold: Platform.select({
    ios: "Pretendard-ExtraBold",
    android: "Pretendard-ExtraBold",
    web: undefined,
  }),
  black: Platform.select({
    ios: "Pretendard-Black",
    android: "Pretendard-Black",
    web: undefined,
  }),
};

export const Text: React.FC<TextProps> = ({ 
  weight = "regular", 
  style, 
  ...props 
}) => {
  const fontFamily = fontFamilyMap[weight];
  
  return (
    <DefaultText
      {...props}
      style={[
        { fontFamily },
        style,
      ]}
    />
  );
};
