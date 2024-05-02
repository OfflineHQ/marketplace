import { screen } from '@storybook/test';
import OffKeyGate from './OffKeyGate';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';

import { ConnectStatus, OffKeyState } from '@next/iframe';
import { ReactQueryDecorator } from '@test-utils/storybook-decorators';
import {
  authMocks,
  shopifyCustomerMatchingAccount,
} from '../OffKeyProfile/examples';
import { OffKeyGateDemo, offKeyGateProps } from './examples';

const authConnected = {
  walletAuthMocks: {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    wallet: {
      getAddress: () => null,
      connected: true,
    },
    isReady: true,
    isConnecting: false,
  },
  useIframeConnectMocks: {
    connectStatus: ConnectStatus.CONNECTED,
    disconnectFromDapp: () => Promise.resolve(),
    signWithEthereum: () => Promise.resolve(),
    askForWalletConnectStatus: () => Promise.resolve(),
  },
};

const meta = {
  component: OffKeyGate,
  render: OffKeyGateDemo,
  decorators: [ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () =>
        authMocks({
          ...authConnected,
          shopifyCustomerMocks: {
            ...shopifyCustomerMatchingAccount,
            offKeyState: OffKeyState.Unlocked,
          },
        }),
    },
  },
  args: offKeyGateProps,
} satisfies Meta<typeof OffKeyGate>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {
  play: async ({ container }) => {
    await screen.findAllByText(/Unlocked/i);
    await screen.findByText(/My Product/i);
  },
};

export const Unlocking: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          ...authConnected,
          shopifyCustomerMocks: {
            ...shopifyCustomerMatchingAccount,
            offKeyState: OffKeyState.Unlocking,
          },
        }),
    },
  },
  play: async ({ container }) => {
    await screen.findAllByText(/Unlocking/i);
  },
};

export const Used: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          ...authConnected,
          shopifyCustomerMocks: {
            ...shopifyCustomerMatchingAccount,
            offKeyState: OffKeyState.Used,
          },
        }),
    },
  },
  play: async ({ container }) => {
    await screen.findByText(/My Product/i);
    await screen.findAllByText(/Used/i);
  },
};

export const Locked: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          ...authConnected,
          shopifyCustomerMocks: {
            ...shopifyCustomerMatchingAccount,
            offKeyState: OffKeyState.Locked,
          },
        }),
    },
  },
  play: async ({ container }) => {
    await screen.findByText(/My Product/i);
    await screen.findAllByText(/Locked/i);
  },
};

export const Loading: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          ...authConnected,
          shopifyCustomerMocks: {
            customer: null,
            status: null,
            offKeyState: undefined,
          },
        }),
    },
  },
};
