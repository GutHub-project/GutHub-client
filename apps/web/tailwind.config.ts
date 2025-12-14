import sharedConfig from '@repo/tailwind-config';
import path from 'path';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.tsx',
    './src/**/*.tsx',
    '../../packages/main-feature/src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
    './node_modules/@repo/main-feature/src/**/*.{ts,tsx}',
    './node_modules/@repo/shared/src/**/*.{ts,tsx}',
    path.join(path.dirname(require.resolve('@repo/main-feature/src')), '**/*.{js,jsx,ts,tsx}'),
    path.join(path.dirname(require.resolve('@repo/shared/src')), '**/*.{js,jsx,ts,tsx}'),
  ],
  presets: [sharedConfig],
};

export default config;
