import { screen } from '@storybook/test';
import { OffKeyGate } from './OffKeyGate';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';

import { ReactQueryDecorator } from '@test-utils/storybook-decorators';
import { OffKeyState } from '../types';
import { OffKeyGateDemo, offKeyGateMocks } from './examples';

const meta = {
  component: OffKeyGate,
  render: OffKeyGateDemo,
  decorators: [ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () =>
        offKeyGateMocks({
          gateState: OffKeyState.Unlocked,
        }),
    },
  },
  args: {
    gateId: '1',
    address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
    initialGateState: OffKeyState.Unlocked,
  },
} satisfies Meta<typeof OffKeyGate>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {
  play: async ({ container }) => {
    await screen.findAllByText(/Unlocked/i);
  },
};

export const Unlocking: Story = {
  args: {
    initialGateState: OffKeyState.Unlocking,
  },
  play: async ({ container }) => {
    await screen.findAllByText(/Unlocking/i);
  },
};

export const Used: Story = {
  args: {
    initialGateState: OffKeyState.Used,
  },
  play: async ({ container }) => {
    await screen.findAllByText(/Used/i);
  },
};

export const Locked: Story = {
  args: {
    initialGateState: OffKeyState.Locked,
  },
  play: async ({ container }) => {
    await screen.findAllByText(/Locked/i);
  },
};
