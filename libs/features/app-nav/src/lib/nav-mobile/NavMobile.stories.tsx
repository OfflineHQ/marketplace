import type { Meta } from '@storybook/react';
import { NavMobile } from './NavMobile';
import { NavMobileExample } from './examples';

const Story: Meta<typeof NavMobile> = {
  component: NavMobile,
  render: NavMobileExample,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
};
export default Story;

export const Primary = {
  args: {},
};
