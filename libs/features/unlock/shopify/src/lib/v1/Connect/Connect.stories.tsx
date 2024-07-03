import { StoryObj, type Meta } from '@storybook/react';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { V1Connect } from './Connect';
import { ConnectDemo, authMocks, shopifyContext } from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

const walletConnectedProps = {
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
};

const meta = {
  component: V1Connect,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  render: ConnectDemo,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: null,
            customer: null,
            walletInStorage: [{ address }, { address: '0x214123135' }],
            shopifyContext,
          },
          ...walletConnectedProps,
        }),
    },
  },
} satisfies Meta<typeof V1Connect>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};
