import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.tsx',
    './src/**/*.tsx',
    '../../packages/main-feature/src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
};

export default config;
