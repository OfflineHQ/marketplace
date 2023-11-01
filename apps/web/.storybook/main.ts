import { mainConfig } from '../../../storybook/storybook.nextjs.main.base';

const isCI = !!process.env.GITHUB_EVENT_NAME; // Check if running in CI

module.exports = {
  stories: [
    '../../../libs/features/**/*.stories.@(js|ts|tsx)',
    '../../../libs/features/**/*.mdx',
    '../../../libs/next/hygraph/**/*.stories.@(js|ts|tsx)',
    '../../../libs/next/date/**/*.stories.@(js|ts|tsx)',
  ],
  features: {
    storyStoreV7: !isCI,
  },
  ...mainConfig,
};
