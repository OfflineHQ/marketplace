import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { LocalPassList } from './LocalPassList';
import { LocalPassListExample } from './examples';
import { sleep } from '@utils';

// Import the stories you want to reuse

const meta: Meta<typeof LocalPassList> = {
  component: LocalPassList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof LocalPassList>;

export const Default: Story = {
  render: LocalPassListExample,
};

export const Opened: Story = {
  ...Default,
  play: async () => {
    const accordionTrigger = await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    accordionTrigger.click();
    await screen.findByText(/2 x/i);
    await screen.findByText(/General Admission/i);
    await screen.findByText(/1 x/i);
    await screen.findByText(/VIP Pass/i);
  },
};

// export const TestDelete: Story = {
//   ...Opened,
//   play: async (context) => {
//     if (Opened.play) {
//       await Opened.play(context);
//       userEvent.click(
//         screen.getByRole('button', {
//           name: /Delete/i,
//         })
//       );
//       await sleep(100);
//       expect(screen.getByText(/General Admission/i)).toBeNull();
//       expect(screen.findByText(/Lorem ipsum/i)).toBeNull();
//     }
//   },
// };

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
