import type { Meta } from '@storybook/react';
import { RoleAvatar } from './RoleAvatar';
import {
  RoleAvatarExample,
  organizerRole,
  organizerRoleWithoutImage,
} from './examples';

const Story: Meta<typeof RoleAvatar> = {
  component: RoleAvatar,
  title: 'RoleAvatar',
  parameters: {
    screen: {
      mobile: true,
    },
  },
  args: {
    role: organizerRole,
  },
};
export default Story;

export const OrganizerWithImage = {
  args: {
    role: organizerRole,
  },
};

export const OrganizerWithoutImage = {
  args: {
    role: organizerRoleWithoutImage,
  },
};
