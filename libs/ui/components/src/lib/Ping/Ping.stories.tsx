import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';

import { Ping } from './Ping';
import { PingButtonDemo } from './examples';

const meta = {
  title: 'Atoms/Ping',
  component: Ping,
  render: PingButtonDemo,
  args: {},
} satisfies Meta<typeof Ping>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    isActive: true,
  },
} satisfies Story;

export const WithNumber = {
  args: {
    isActive: true,
    number: 3,
  },
} satisfies Story;

export const WithNumberDoubleDigit = {
  args: {
    isActive: true,
    number: 12,
  },
} satisfies Story;
