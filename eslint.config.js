/* eslint-disable @typescript-eslint/no-require-imports */
const { FlatCompat } = require('@eslint/eslintrc');
const typeScriptEsLintPlugin = require('@typescript-eslint/eslint-plugin');
const { fixupPluginRules } = require('@eslint/compat');
const reactEslint = require('eslint-plugin-react');
const rnEslint = require('eslint-plugin-react-native');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typeScriptEsLintPlugin.configs['recommended'],
});

module.exports = [
  ...compat.config({
    env: { node: true },
    extends: [
      // "airbnb",
      // "airbnb/hooks",
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
    plugins: ['@typescript-eslint'],
  }),
  {
    rules: {
      'require-jsdoc': 'off',
      'no-invalid-this': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      // "import/no-unresolved": 0,
      'react/function-component-definition': [
        1,
        {
          namedComponents: [
            'function-declaration',
            'function-expression',
            'arrow-function',
          ],
          unnamedComponents: ['function-expression', 'arrow-function'],
        },
      ],
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.ts', '.tsx'],
        },
      ],
      'react/require-default-props': 0,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'avoid',
          endOfLine: 'auto',
        },
      ],
      'max-len': [
        2,
        {
          code: 140,
          ignoreStrings: true,
          ignoreUrls: true,
        },
      ],
      'no-shadow': 'off',
      'global-require': 0,
      'no-console': 'off',
      'react/jsx-props-no-spreading': 0,
      'react/state-in-constructor': 0,
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // "import/no-extraneous-dependencies": [
      //     "error",
      //     {
      //         "devDependencies": true,
      //         "optionalDependencies": true,
      //         "peerDependencies": true
      //     }
      // ],
      'react/no-unstable-nested-components': 'off',
      'react/destructuring-assignment': 'off',
    },
  },
  {
    plugins: {
      react: reactEslint,
      'react-native': fixupPluginRules(rnEslint),
    },
    rules: {
      'react-native/no-inline-styles': 0,
    },
  },
];
