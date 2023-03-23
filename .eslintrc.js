module.exports = {
  extends: [
    'react-app',
    'kentcdodds/react',
    'kentcdodds/import',
    'kentcdodds/jsx-a11y',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:unicorn/recommended',
  ],
  plugins: ['unicorn'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@pages', './src/pages'],
          ['@context', './src/context'],
          ['@components', './src/components'],
          ['@icons', './src/components/Icons'],
          ['@services', './src/services'],
          ['@utils', './src/utils'],
          ['@factories', './src/factories'],
          ['@models', './src/models'],
          ['@mock', './__mock__'],
          ['~', './cypress'],
          ['__mock__', './__mock__'],
        ],
      },
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    'unicorn/filename-case': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/regex-shorthand': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-null': 'off',
    'unicorn/expiring-todo-comments': 'off',
    'no-console': 'error',
    'no-debugger': 'error',
    'import/dynamic-import-chunkname': 'error',

    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',

    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'enforce',
        custom: 'enforce',
      },
    ],
    'react/no-danger': 'error',
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-console': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      files: ['.eslintrc.js'],
      rules: {
        'unicorn/prefer-module': 'off',
      },
    },
    {
      files: ['cypress/**/*.js'],
      rules: {
        'jest/valid-expect-in-promise': 'off',
        'jest/valid-expect': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};
