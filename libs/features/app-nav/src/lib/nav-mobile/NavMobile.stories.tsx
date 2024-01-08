import type { Meta } from '@storybook/react';
import { NavMobile } from './NavMobile';
import { NavMobileExample } from './examples';

const Story: Meta<typeof NavMobile> = {
  component: NavMobile,
  render: NavMobileExample,
  parameters: {
    viewport: {
      defaultViewport: 'small_mobile',
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: 'small_mobile',
        },
      },
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
