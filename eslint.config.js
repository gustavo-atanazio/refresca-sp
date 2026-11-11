// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*']
  },
  {
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'react/jsx-tag-spacing': ['error', {
        'beforeSelfClosing': 'never'
      }],
      'eol-last': ['error', 'never'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type']
    }
  },
  {
    files: ['server/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
]);