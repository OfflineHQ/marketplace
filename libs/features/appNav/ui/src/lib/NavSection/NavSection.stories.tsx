import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';
import { NavSection, NavSectionSkeleton } from './NavSection';
import { Cart as CartIcon, QrCode } from '@ui/icons';
import { NavSectionDemo, cartNavProps } from './examples';

const meta = {
  component: NavSection,
  render: (props) => NavSectionDemo(props, CartIcon, 'Cart'),
  args: cartNavProps,
} satisfies Meta<typeof NavSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cart: Story = {};

export const Skeleton: Story = {
  render: NavSectionSkeleton,
};
