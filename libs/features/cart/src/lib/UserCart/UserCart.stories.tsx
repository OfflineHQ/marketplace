import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { UserCart } from './UserCart';
import { UserCartExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof UserCart> = {
  component: UserCart,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof UserCart>;

export const SectionWithUserOpened: Story = {
  render: UserCartExample,
  play: async (context) => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      }),
    );
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      }),
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
  },
};
