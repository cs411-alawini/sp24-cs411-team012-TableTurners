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
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        printWidth: 125,
      },
    ],
  },
};
