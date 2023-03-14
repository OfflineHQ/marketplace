import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { delayData } from '@test-utils/functions';

import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary = {
  args: {
    children: 'Primary',
  },
} satisfies Story;

export const Secondary = {
  args: {
    children: 'Secondary',
    variant: 'outline',
  },
} satisfies Story;

export const Disabled = {
  args: {
    children: 'Disabled button',
    disabled: true,
  },
} satisfies Story;

export const Loading = {
  args: {
    children: 'Button with Loading',
    action: () => delayData(3000, null),
    isLoading: true,
  },
} satisfies Story;

export const WithIcon = {
  args: {
    children: 'Button with Icon',
    icon: HiOutlineArrowRight,
    action: () => delayData(3000, null),
  },
} satisfies Story;

export const WithTestClick = {
  args: {
    children: 'Button with Click and Loading',
    action: () => delayData(1000, null),
  },
  play: async ({ canvasElement, controls }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    // Check that the spinner is present
    expect(screen.queryByRole('status')).toBeInTheDocument();
  },
} satisfies Story;

export const SecondaryWithIconRight = {
  args: {
    children: 'Secondary with Icon Right',
    variant: 'outline',
    iconRight: HiOutlineArrowRight,
    action: () => delayData(3000, null),
  },
} satisfies Story;

export const SecondaryWithIconRightLoading = {
  args: {
    children: 'Secondary with Icon Right and Loading',
    variant: 'outline',
    iconRight: HiOutlineArrowRight,
    action: () => delayData(3000, null),
    isLoading: true,
  },
} satisfies Story;

export const Small = {
  args: {
    children: 'Small',
    size: 'sm',
    icon: HiOutlineArrowRight,
    action: () => delayData(3000, null),
  },
} satisfies Story;

export const ExtraSmall = {
  args: {
    children: 'Extra Small',
    size: 'xs',
    icon: HiOutlineArrowRight,
    action: () => delayData(3000, null),
  },
} satisfies Story;
