export const colors = {
  main: "#FF7878",
  sub: "#FFA4A4",
  text: "#3C3F44",
  white: "#FFFFFF",
  "Black-100": "#FAFAFA",
  "Black-200": "#F6F6F6",
  "Black-300": "#EFEFEF",
  "Black-400": "#DEDEDE",
  "Black-500": "#C2C2C2",
  "Black-600": "#979797",
  "Black-700": "#818181",
  "Black-800": "#494949",
  Black: "#000000",
} as const;

export type ColorKey = keyof typeof colors;

