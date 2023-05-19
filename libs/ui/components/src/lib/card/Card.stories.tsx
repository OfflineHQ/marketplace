import {
  CardDemo,
  CardWithForm,
  CardWithOverflow,
  CardSkeleton,
} from './examples';
import { Card } from './Card';

import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  render: CardDemo,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullSizeStickyFooter: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};

export const FullSizeStickyFooterOverflow: Story = {
  ...FullSizeStickyFooter,
  render: CardWithOverflow,
};

export const WithForm: Story = {
  render: CardWithForm,
};

export const Loading: Story = {
  render: CardSkeleton,
};
