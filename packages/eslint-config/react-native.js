module.exports = {
  extends: ['./react.js'],
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react-native'],
  rules: {
    // 사용하지 않는 스타일 경고
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    // 인라인 스타일 사용 경고 
    'react-native/no-inline-styles': 'warn',
  },
};

