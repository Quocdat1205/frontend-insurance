module.exports = {
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'airbnb/hooks',
  ],
  plugins: ['prettier', 'import'],
  rules: {
    // 'prettier/prettier': ['error', { endOfLine: 'auto', },],
    'prettier/prettier': ['warn', { endOfLine: 'auto', singleQuote: true }],
    'import/no-unresolved': 'error', // turn on errors for missing imports
    'react/jsx-filename-extension': [0, { extensions: ['.tsx'] }],
    camelcase: 'off',
    'import/no-cycle': 'off',
    'default-param-last': 'off',
    'no-return-await': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-underscore-dangle': 'off',
    'quote-props': 'off',
    radix: 'off',
    'class-methods-use-this': 'off',
    'interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'react/jsx-props-no-spreading': [
      0,
      { html: 'ignore', custom: 'ignore', explicitSpread: 'ignore' },
    ],
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'ignore',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
    'import/newline-after-import': 1,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json',
      },
    },
  },
}
