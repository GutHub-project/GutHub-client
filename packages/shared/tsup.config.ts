import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "stores/index": "src/stores/index.ts",
    "providers/index": "src/providers/index.ts",
    "components/index": "src/components/index.ts",
    "hooks/index": "src/hooks/index.ts",
  },
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      skipLibCheck: true,
      jsx: "react-jsx",
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
  },
  banner: {
    js: "'use client';",
  },
  clean: true,
  external: [
    "react",
    "react-dom",
    "react-native",
    "axios",
    "zustand",
    "@tanstack/react-query",
    "next",
    "tailwind-merge",
    "@react-native-cookies/cookies",
    "react-native-encrypted-storage"
  ],
  injectStyle: true,
});

