import type { Meta } from '@storybook/react';
import { menuSections } from '../nav-desktop/examples';
import { HeaderNav } from './HeaderNav';
import { HeaderNavExample } from './examples';

const Story: Meta<typeof HeaderNav> = {
  component: HeaderNav,
  render: HeaderNavExample,
  args: {
    menuSections,
    session: null,
    signIn: () => null,
  },
};
export default Story;

export const Default = {
  args: {},
};
