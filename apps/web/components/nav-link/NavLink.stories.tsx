import type { Meta, StoryObj } from '@storybook/react';

import { NavLink } from './NavLink';
import { NavLinkExample } from './examples';

const meta = {
  component: NavLink,
} satisfies Meta<typeof NavLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'link',
    children: 'A link',
  },
  render: NavLinkExample,
};
