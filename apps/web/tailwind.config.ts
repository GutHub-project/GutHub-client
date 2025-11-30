import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.tsx', './src/**/*.tsx'],
  presets: [sharedConfig],
  // Tailwind CSS v4 호환성을 위해 theme을 직접 확장
  theme: {
    extend: {
      colors: {
        main: '#FF7878',
        sub: '#FFA4A4',
        text: '#3C3F44',
        white: '#FFFFFF',
        'Black-100': '#FAFAFA',
        'Black-200': '#F6F6F6',
        'Black-300': '#EFEFEF',
        'Black-400': '#DEDEDE',
        'Black-500': '#C2C2C2',
        'Black-600': '#979797',
        'Black-700': '#818181',
        'Black-800': '#494949',
        Black: '#000000',
      },
    },
  },
};

export default config;
