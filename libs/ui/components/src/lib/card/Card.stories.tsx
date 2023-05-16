import { CardDemo, CardWithForm, CardOverflow } from './examples';
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

export const Default: Story = {};

export const Overflow: Story = {
  render: CardOverflow,
};

export const WithForm: Story = {
  render: CardWithForm,
};
