import type { Meta } from '@storybook/react';
import { ProfileNav } from './ProfileNav';
import { ProfileNavExample } from './examples';
import { cryptoUserSession } from '../profile-avatar/examples';

const Story: Meta<typeof ProfileNav> = {
  component: ProfileNav,
  render: ProfileNavExample,
  parameters: {
    screen: {
      mobile: true,
    },
  },
  args: {
    session: cryptoUserSession,
  },
};
export default Story;

export const Primary = {
  args: {},
};
