import { mainConfig } from '../../../storybook/storybook.nextjs.main.base';

const isCI = !!process.env.GITHUB_EVENT_NAME; // Check if running in CI

module.exports = {
  stories: [
    '../../../libs/features/back-office/**/*.stories.@(js|ts|tsx)',
    '../../../libs/features/back-office/**/*.mdx',
  ],
  features: {
    storyStoreV7: !isCI,
    // experimentalNextRSC: true, // to activate when v8 supported by nx
  },
  ...mainConfig,
};
