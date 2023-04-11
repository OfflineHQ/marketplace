import type { Meta } from '@storybook/react';
import { NavDesktop } from './NavDesktop';
import { NavDesktopExample } from './examples';

const Story: Meta<typeof NavDesktop> = {
  component: NavDesktop,
  render: NavDesktopExample,
  parameters: {
    layout: 'fullscreen',
  },
};
export default Story;

export const Primary = {
  args: {},
};
