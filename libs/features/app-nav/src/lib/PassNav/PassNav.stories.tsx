import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { PassNav } from './PassNav';
import { PassNavDemo, passNavProps } from './examples';

const meta = {
  component: PassNav,
  render: (props) => PassNavDemo(props),
  args: passNavProps,
} satisfies Meta<typeof PassNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pass: Story = {};

export const PassActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/pass',
      },
    },
  },
};

export const PassWithHelperText: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/pass/i));
    // Check that the helper text is present
    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes('Go to your pass')
      );
    });
  },
};

export const PassWithPing: Story = {
  args: {
    ping: { isActive: true },
  },
};

export const PassWithPingAndNumber: Story = {
  args: {
    ping: { isActive: true, number: 3 },
  },
};

export const PassLoading: Story = {
  args: {
    isLoading: true,
  },
};
