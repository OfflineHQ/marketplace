import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
  waitFor,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { AppNavLayout } from './AppNavLayout';
import {
  ProfileNavWithNoUser,
  ProfileNavWithNormalUser,
  ProfileNavWithCryptoUser,
  ProfileNavWithFallbackUser,
  CartNavEmpty,
  CartNavWithItems,
  PassNavEmpty,
  PassNavWithPing,
  PassNavLoading,
  NavSectionLoading,
  ProfileNavLoading,
} from './examples';

const meta = {
  component: AppNavLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppNavLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithNoUser: Story = {
  args: {
    children: 'test',
    profile: <ProfileNavWithNoUser />,
    cart: <CartNavEmpty />,
    pass: <PassNavEmpty />,
  },
};

export const WithNormalUser: Story = {
  args: {
    children: 'test',
    profile: <ProfileNavWithNormalUser />,
    cart: <CartNavEmpty />,
    pass: <PassNavEmpty />,
  },
};
export const WithFallbackUser: Story = {
  args: {
    children: 'test',
    profile: <ProfileNavWithFallbackUser />,
    cart: <CartNavEmpty />,
    pass: <PassNavEmpty />,
  },
};

export const WithCryptoUser: Story = {
  args: {
    children: 'test',
    profile: <ProfileNavWithCryptoUser />,
    cart: <CartNavEmpty />,
    pass: <PassNavEmpty />,
  },
};

export const WithCartItems: Story = {
  args: {
    ...WithNormalUser.args,
    cart: <CartNavWithItems />,
  },
};

export const WithPassPing: Story = {
  args: {
    ...WithNormalUser.args,
    pass: <PassNavWithPing />,
  },
};

export const WithPassLoading: Story = {
  args: {
    ...WithNormalUser.args,
    pass: <PassNavLoading />,
  },
};

export const WithPassActive: Story = {
  args: {
    ...WithNormalUser.args,
    pass: <PassNavWithPing />,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/pass',
      },
    },
  },
};

export const WithNavSectionLoading: Story = {
  args: {
    ...WithNormalUser.args,
    cart: <NavSectionLoading />,
  },
};

export const WithProfileNavLoading: Story = {
  args: {
    ...WithNormalUser.args,
    profile: <ProfileNavLoading />,
  },
};

export const WithAllLoading: Story = {
  args: {
    ...WithProfileNavLoading.args,
    cart: <NavSectionLoading />,
    pass: <NavSectionLoading />,
  },
};
