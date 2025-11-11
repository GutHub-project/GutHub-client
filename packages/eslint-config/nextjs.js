module.exports = {
  extends: [
    './react.js',
    'next/core-web-vitals',
  ],

  rules: {
    // <a> 태그 사용 경고 비활성화
    '@next/next/no-html-link-for-pages': 'off',
  },
};

