module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // 사용하지 않는 변수 경고 (단, _로 시작하는 변수는 무시)
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_', // _로 시작하는 인자 무시
        varsIgnorePattern: '^_', // _로 시작하는 변수 무시
      },
    ],
    // any 타입 사용 시 경고
    '@typescript-eslint/no-explicit-any': 'warn',
    // import 순서 정렬
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always', // 그룹 사이에 빈 줄 추가
        alphabetize: {
          order: 'asc', // 알파벳 순서로 정렬
          caseInsensitive: true, // 대소문자 구분 안함
        },
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.next/', '.expo/'],
};

