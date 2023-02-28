import type { StorybookConfig } from '@storybook/react-webpack5';
export const rootMain: StorybookConfig = {
  // TODO include all stories
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@nrwl/react/plugins/storybook',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default rootMain;
