module.exports = {
  presets: [
    '@nrwl/next/babel',
    [
      '@babel/preset-typescript',
      {
        onlyRemoveTypeImports: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
