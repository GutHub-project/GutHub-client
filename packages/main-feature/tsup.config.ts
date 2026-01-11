import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/pages/index.ts",
    "src/apis/auth/index.ts",
    "src/components/web/index.ts",
    "src/components/shopping/index.ts",
    "src/components/shopping/ProductDetailPage.tsx",
    "src/components/shopping/ReviewWritePage.tsx",
    "src/components/shopping/ReviewListPage.tsx",
    "src/components/shopping/ReviewDetailPage.tsx",
    "src/components/shopping/ReviewFilterModal.tsx",
    "src/components/shopping/ShoppingScreen.tsx",
    "src/components/shopping/types.ts",
  ],
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
  external: ["react", "react-dom", "react-native", "@repo/shared"],
  injectStyle: false,
});

