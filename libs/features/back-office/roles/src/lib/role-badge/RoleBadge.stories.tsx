import { Roles_Enum_Not_Const_Values } from '@roles/types';
import { Meta, StoryObj } from '@storybook/react';
import { RoleBadge, RoleBadgeProps } from './RoleBadge';

const roleOptions = Object.values(Roles_Enum_Not_Const_Values).map((role) => ({
  role,
  organizerId: 'fake',
  eventId: '',
}));

const RoleBadgeStory: Meta<typeof RoleBadge> = {
  title: 'Atoms/RoleBadge',
  component: RoleBadge,
  argTypes: {
    role: {
      options: roleOptions,
      control: { type: 'select' },
    },
  },
};

export default RoleBadgeStory;

type RoleBadgeStory = StoryObj<RoleBadgeProps>;

export const DefaultRoleBadge: RoleBadgeStory = {
  args: {
    role: roleOptions[0],
  },
};

const AllRolesComponent: React.FC = () => (
  <>
    {roleOptions.map((role) => (
      <RoleBadge key={role.role} role={role} className="mb-2" />
    ))}
  </>
);

export const AllRoles = {
  render: AllRolesComponent,
  argTypes: {
    role: {
      control: false,
    },
  },
};

export const AllRolesWithDarkMode = {
  render: AllRolesComponent,
  argTypes: {
    role: {
      control: false,
    },
  },
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};
