module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  overrides: [
    {
      files: ['*.graphql', '*.gql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
};
