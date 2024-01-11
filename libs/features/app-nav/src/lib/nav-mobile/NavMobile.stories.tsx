import type { Meta } from '@storybook/react';
import { NavMobile } from './NavMobile';
import { NavMobileExample } from './examples';
import { mobileMode } from '@test-utils/storybook';

const Story: Meta<typeof NavMobile> = {
  component: NavMobile,
  render: NavMobileExample,
  parameters: {
    ...mobileMode,
  },
};
export default Story;

export const Primary = {
  args: {},
};
