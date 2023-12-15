import { Card } from './Card';
import {
  CardDemo,
  CardSkeleton,
  CardWithForm,
  CardWithOverflow,
} from './examples';

import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  render: CardDemo,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};

export const NoBorder: Story = {
  args: {
    noBorder: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Overflow: Story = {
  ...Default,
  render: CardWithOverflow,
};

export const WithForm: Story = {
  render: CardWithForm,
};

export const Distinct: Story = {
  args: {
    variant: 'distinct',
  },
};

export const InsideDistinct: Story = {
  args: {
    variant: 'insideDistinct',
  },
};

export const Loading: Story = {
  render: CardSkeleton,
};

export const LoadingDistinct: Story = {
  ...Loading,
  args: {
    variant: 'distinct',
  },
};
