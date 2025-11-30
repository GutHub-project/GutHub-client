const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

const nextConfig = async () => {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  const env = dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  if (env.error) {
    throw new Error(`Failed to load ${envFile}: ${env.error.message}`);
  }
  console.log('설정된 환경 변수 : ', envFile);

  return {
    reactStrictMode: true,
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
    async redirects() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
          permanent: true,
        },
      ];
    },
  };
};

module.exports = nextConfig;
