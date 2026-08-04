// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: { react: { version: 'detect' } },
  rules: {
    // Disable noisy rules that aren't needed for this project
    'react/react-in-jsx-scope': 'off', // React 17+ handles JSX automatically
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off',
    // Keep hook dependency warnings as warnings
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['dist/**', 'node_modules/**']
};
