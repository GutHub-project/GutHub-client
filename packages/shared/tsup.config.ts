import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "stores/index": "src/stores/index.ts",
    "providers/index": "src/providers/index.ts",
    "components/index": "src/components/index.ts",
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
  external: ["react", "react-native", "axios", "zustand", "@tanstack/react-query"],
  injectStyle: true,
});

