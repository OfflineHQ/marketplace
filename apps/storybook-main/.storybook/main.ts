import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@nrwl/react/plugins/storybook',
  ],
  refs: {
    'web-app': {
      title: 'Web App',
      url: 'http://localhost:4401',
    },
    'ui-library': {
      title: 'UI Library',
      url: 'http://localhost:4402',
    },
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
