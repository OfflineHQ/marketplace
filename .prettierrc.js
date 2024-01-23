module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.base.js',
  overrides: [
    {
      files: ['*.json', '.*rc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
