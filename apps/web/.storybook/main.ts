/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const tsconfig = require('../../../tsconfig.base.json');

const isCI = !!process.env.GITHUB_EVENT_NAME; // Check if running in CI

module.exports = {
  stories: [
    '../../../libs/features/**/*.stories.@(js|ts|tsx)',
    '../../../libs/features/**/*.mdx',
    '../../../libs/next/hygraph/**/*.stories.@(js|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-addon-swc',
    'storybook-dark-mode',
    // Add PostCSS into addons for compiling tailwind below
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.js'),
    },
    interactionsDebugger: true,
  },
  features: {
    storyStoreV7: !isCI,
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config, { configType }) => {
    // Used to fix the issue with next-intl url module
    config.resolve.fallback = {
      ...config.resolve.fallback, // This spreads the existing fallback configuration if there is any
      url: false,
    };
    // This modifies the existing image rule to exclude `.svg` files
    // since we handle those with `@svgr/webpack`.
    const imageRule = config.module.rules.find((rule) =>
      rule.test?.test('.svg')
    );
    imageRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    //
    // Add tsconfig-paths-webpack-plugin to the resolve.plugins array
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../../tsconfig.base.json'),
      }),
    ];
    // Add aliases from tsconfig.base.json to the resolve.alias object
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      const aliases = tsconfig.compilerOptions.paths;
      for (const alias in aliases) {
        const paths = aliases[alias].map((p) =>
          path.resolve(__dirname, '../../../', p)
        );
        config.resolve.alias[alias.replace('/*', '')] =
          paths.length > 1 ? paths : paths[0];
      }
    }
    return config;
  },
};
