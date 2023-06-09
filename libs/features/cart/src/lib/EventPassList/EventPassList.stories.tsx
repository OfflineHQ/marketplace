import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { EventPassList } from './EventPassList';
import { EventPassListExample, EventPassListLoadingExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof EventPassList> = {
  component: EventPassList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof EventPassList>;

export const Default: Story = {
  render: EventPassListExample,
};

export const Opened: Story = {
  ...Default,
  play: async () => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      })
    );
    await screen.findByText(/2 x/i);
    await screen.findByText(/General Admission/i);
    await screen.findByText(/1 x/i);
    await screen.findByText(/VIP Pass/i);
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      })
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
    return removeButtons;
  },
};

// export const Remove: Story = {
//   ...Opened,
//   play: async (context) => {
//     if (Opened.play) {
//       const removeButtons = await Opened.play(context);
//       await userEvent.click(removeButtons[0]);
//       expect(
//         await screen.findByRole('button', {
//           name: /World cup/i,
//         })
//       );
//       expect(
//         screen.queryByRole('button', {
//           name: /Lorem ipsum/i,
//         })
//       ).toBeNull();
//     }
//   },
// };

export const Loading: Story = {
  render: EventPassListLoadingExample,
};
