import type { Meta, StoryObj } from '@storybook/react';
// import { cryptoUserSession } from '../profile-avatar/examples';
import { ProfileNav, ProfileNavSkeleton } from './ProfileNav';
import { ProfileNavExample } from './examples';

const meta = {
  component: ProfileNav,
  render: ProfileNavExample,
  args: {
    // user: cryptoUserSession,
    // items: cryptoUserMenuItems,
  },
} satisfies Meta<typeof ProfileNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Skeleton: Story = {
  render: ProfileNavSkeleton,
};
