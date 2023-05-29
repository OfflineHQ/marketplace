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
  CartNavEmpty,
  CartNavWithItems,
  PassNavEmpty,
  PassNavWithPing,
  NavSectionLoading,
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
