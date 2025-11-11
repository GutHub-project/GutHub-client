module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // react import 비활성화
    'react/react-in-jsx-scope': 'off',
    // prop-types 비활성화
    'react/prop-types': 'off',
    // hooks 규칙 위반 시 에러
    'react-hooks/rules-of-hooks': 'error',
    // useEffect 의존성 배열 누락 시 경고
    'react-hooks/exhaustive-deps': 'warn',
  },
};

