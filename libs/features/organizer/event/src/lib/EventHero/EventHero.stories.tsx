import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';
import { EventHero } from './EventHero';
import { eventHeroProps } from './examples';

const meta = {
  component: EventHero,
  args: eventHeroProps,
} satisfies Meta<typeof EventHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
