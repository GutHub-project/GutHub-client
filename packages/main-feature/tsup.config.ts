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
  dts: true,
  splitting: false,
  sourcemap: false,
  banner: {
    js: "'use client';",
  },
  clean: true,
  external: ["react", "react-dom", "react-native", "@repo/shared", "next", "next/image", "next/navigation"],
  treeshake: true,
});

