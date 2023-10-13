import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { UserCartSection } from './UserCartSection';
import { UserCartExample, UserCartLoadingExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof UserCartSection> = {
  component: UserCartSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof UserCartSection>;

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

export const SectionUserLoading: Story = {
  render: UserCartLoadingExample,
};
