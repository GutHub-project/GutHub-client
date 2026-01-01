const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

const nextConfig = async () => {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  const env = dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  if (env.error) {
    console.warn(`⚠️  환경 변수 파일을 찾을 수 없습니다: ${envFile}. 환경 변수는 시스템 환경 변수에서 로드됩니다.`);
  } else {
    console.log('설정된 환경 변수 : ', envFile);
  }

  return {
    reactStrictMode: true,
    transpilePackages: ['@repo/shared', '@repo/main-feature'],
    webpack: (config) => {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'react-native$': 'react-native-web',
      };
      config.resolve.extensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions];

      // @react-native/assets-registry 모듈을 stub으로 대체
      const stubPath = path.resolve(__dirname, 'webpack-stubs/assets-registry.js');
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^@react-native\/assets-registry\/registry$/, stubPath)
      );
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^@react-native\/assets-registry$/, stubPath));

      return config;
    },
    async rewrites() {
      // API 프록시 설정 (Mixed Content 방지)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.guthub.shop:8080';
      console.log('[Next.js rewrites] API_URL:', apiUrl);

      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ];
    },
  };
};

module.exports = nextConfig;
