import type { Meta, StoryObj } from '@storybook/react';
import { Cart as CartIcon } from '@ui/icons';
import { NavSection, NavSectionSkeleton } from './NavSection';
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
