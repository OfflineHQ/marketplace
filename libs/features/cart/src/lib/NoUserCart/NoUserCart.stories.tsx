import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { NoUserCart } from './NoUserCart';
import {
  NoUserCartExample,
  NoUserCartLoadingExample,
  NoUserCartNoCartExample,
} from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof NoUserCart> = {
  component: NoUserCart,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof NoUserCart>;

export const SectionWithNoUserOpened: Story = {
  render: NoUserCartExample,
  play: async (context) => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      })
    );
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      })
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
  },
};

export const SectionWithNoUserOpenedRemove: Story = {
  ...SectionWithNoUserOpened,
  play: async (context) => {
    if (SectionWithNoUserOpened.play)
      await SectionWithNoUserOpened.play(context);
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);
    expect(
      await screen.findByRole('button', {
        name: /World cup/i,
      })
    );
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      })
    ).toBeNull();
  },
};

export const SectionWithNoUserNoCart: Story = {
  render: NoUserCartNoCartExample,
  play: async (context) => {
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      })
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /World Cup/i,
      })
    ).toBeNull();
  },
};

export const SectionWithNoUserLoading: Story = {
  render: NoUserCartLoadingExample,
};
