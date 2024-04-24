import { expect, screen } from '@storybook/test';
import OffKeyHeaderNotConnected from './OffKeyHeaderNotConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';

import { ReactQueryDecorator } from '@test-utils/storybook-decorators';
import { iframeOffKeyMocks } from '../OffKeyHeaderConnected/examples';
const meta = {
  component: OffKeyHeaderNotConnected,
  decorators: [ReactQueryDecorator],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => [
        iframeOffKeyMocks({
          offKeyState: null,
          customer: null,
        }),
      ],
    },
  },
} satisfies Meta<typeof OffKeyHeaderNotConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WaitingForCustomer: Story = {
  play: async ({ container }) => {
    expect(screen.queryByText(/OffKeyHeaderNotConnected/i)).toBeNull();
  },
};

export const WithCustomer: Story = {
  parameters: {
    moduleMock: {
      mock: () => [
        iframeOffKeyMocks({
          offKeyState: null,
          customer: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@doe.com',
          },
        }),
      ],
    },
  },
  play: async ({ container }) => {
    expect(screen.getByText(/OffKeyHeaderNotConnected/i)).toBeInTheDocument();
  },
};
