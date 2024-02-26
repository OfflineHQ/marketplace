import * as kycApi from '@features/kyc-actions';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import * as nextAuth from 'next-auth/react';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import { Auth } from './Auth';
import { AuthExample } from './examples';

const meta = {
  component: Auth,
  render: AuthExample,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => {
        const mockSignIn = createMock(nextAuth, 'signIn');
        mockSignIn.mockReturnValue({ error: null });
        const mockSignOut = createMock(nextAuth, 'signOut');
        mockSignOut.mockReturnValue({});
        // const mockWallet = createMock(walletHook, 'useWalletAuth');
        // mockWallet.mockImplementation(() => ({
        //   isReady: true,
        //   connect: () => Promise.resolve(),
        //   disconnect: () => Promise.resolve(),
        //   isConnecting: false,
        //   isConnected: true,
        //   wallet: {} as any,
        // }));
        // const mockAuth = createMock(authProvider, 'useAuthContext');
        // mockAuth.mockReturnValue({
        //   connecting: false,
        //   login: () => Promise.resolve(),
        //   logout: () => Promise.resolve(),
        //   createAccount: () => Promise.resolve(),
        // });
        const mockInitKyc = createMock(kycApi, 'initKyc');
        mockInitKyc.mockReturnValue({
          user: {},
          accessToken: 'accessToken',
        });
        const mockApplicantStatusChanged = createMock(
          kycApi,
          'handleApplicantStatusChanged',
        );
        mockApplicantStatusChanged.mockReturnValue(false);
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        return [
          // comethWallet,
          // connectAdaptor,
          mockSignIn,
          mockSignOut,
          mockIntl,
          mockInitKyc,
          mockApplicantStatusChanged,
        ];
      },
    },
  },
} satisfies Meta<typeof Auth>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
