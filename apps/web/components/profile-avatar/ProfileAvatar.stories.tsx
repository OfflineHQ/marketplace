import type { Meta } from '@storybook/react';
import { ProfileAvatar } from './ProfileAvatar';
import {
  ProfileAvatarExample,
  cryptoUserSession,
  normalUserSession,
  normalUserSessionWithImage,
} from './examples';

const Story: Meta<typeof ProfileAvatar> = {
  component: ProfileAvatar,
  render: ProfileAvatarExample,
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

export const CryptoUser = {
  args: {},
};

export const NormalUser = {
  args: {
    session: normalUserSession,
  },
};

export const NormalUserWithImage = {
  args: {
    session: normalUserSessionWithImage,
  },
};
