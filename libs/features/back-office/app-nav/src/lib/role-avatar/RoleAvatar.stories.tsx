import type { Meta } from '@storybook/react';
import { RoleAvatar } from './RoleAvatar';
import {
  RoleAvatarExample,
  organizerRoleAdmin,
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
    role: organizerRoleAdmin,
  },
};
export default Story;

export const OrganizerWithImage = {};

export const OrganizerWithoutImage = {
  args: {
    role: organizerRoleWithoutImage,
  },
};
