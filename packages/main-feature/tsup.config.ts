import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "pages/index": "src/pages/index.ts",
    "apis/auth": "src/apis/auth/index.ts",
    "components/web/index": "src/components/web/index.ts",
    "components/shopping/index": "src/components/shopping/index.ts",
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
    "@repo/shared",
    "next",
    "next/image",
    "next/navigation",
    "axios",
    "zustand",
    "@tanstack/react-query",
  ],
  injectStyle: true,
});

