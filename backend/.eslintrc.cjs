module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['./node_modules/gts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        printWidth: 125,
      },
    ],
  },
};
