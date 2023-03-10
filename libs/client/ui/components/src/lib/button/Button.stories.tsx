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
    txt: 'Primary',
    outline: false,
    size: 'md',
  },
} satisfies Story;

export const Secondary = {
  args: {
    txt: 'Secondary',
    outline: true,
    size: 'md',
  },
} satisfies Story;

export const WithIcon = {
  args: {
    txt: 'Button with Icon',
    outline: false,
    size: 'md',
    icon: HiOutlineArrowRight,
  },
} satisfies Story;

export const WithClick = {
  args: {
    txt: 'Button with Click',
    outline: false,
    size: 'md',
    action: () => delayData(2000, null),
  },
} satisfies Story;

export const WithClickAndLoading = {
  args: {
    txt: 'Button with Click and Loading',
    outline: false,
    size: 'md',
    action: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  },
} satisfies Story;

export const WithTestClick = {
  args: {
    txt: 'Button with Click and Loading',
    action: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  play: async ({ canvasElement, controls }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    // Check that the spinner is present
    expect(screen.queryByRole('status')).toBeInTheDocument();
  },
} satisfies Story;
