import { screen, userEvent, waitFor } from '@storybook/test';
import { OffKeyHeaderConnected } from './OffKeyHeaderConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import { OffKeyProfileExample, authMocks } from '../OffKeyProfile/examples';

import { ConnectStatus } from '@next/iframe';
import { ReactQueryDecorator } from '@test-utils/storybook-decorators';
import React from 'react';
import { OffKeyViewHeaderConnected } from '../types';
const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
const meta = {
  component: OffKeyHeaderConnected,
  decorators: [ReactQueryDecorator],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () =>
        authMocks({
          walletAuthMocks: {
            connect: () => Promise.resolve(),
            disconnect: () => Promise.resolve(),
            wallet: {
              getAddress: () => address,
              connected: true,
            },
            isReady: true,
            isConnecting: false,
          },
          walletContextMocks: {
            walletConnected: address,
            autoConnectAddress: '',
          },
          useIframeConnectMocks: {
            connectStatus: ConnectStatus.CONNECTED,
            disconnectFromDapp: () => Promise.resolve(),
            signWithEthereum: () => Promise.resolve(),
            askForWalletConnectStatus: () => Promise.resolve(),
          },
        }),
    },
  },
  args: {
    profile: (
      <OffKeyProfileExample
        user={{
          id: '1',
          address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
        }}
      />
    ),
  },
} satisfies Meta<typeof OffKeyHeaderConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    viewType: OffKeyViewHeaderConnected.Default,
  },
  play: async ({ container }) => {
    const profileButton = await screen.findAllByText('🌶');
    await userEvent.click(profileButton[0]);
    await waitFor(() => screen.queryByText(/sign out/i));
  },
};
