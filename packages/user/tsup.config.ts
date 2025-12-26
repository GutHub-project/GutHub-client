import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/components/index.ts', 'src/hooks/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      skipLibCheck: true,
      jsx: 'react-jsx',
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      rootDir: undefined,
      moduleResolution: 'bundler',
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-native', '@repo/shared', '@repo/main-feature', '@repo/tailwind-config'],
});
