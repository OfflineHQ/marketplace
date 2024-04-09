import { ConnectStatus } from '@next/iframe';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import { OffKeyHeaderConnectedExamples } from '../OffKeyHeaderConnected/examples';
import { OffKeyLayout } from '../OffKeyLayout/OffKeyLayout';
import { authMocks } from '../OffKeyProfile/examples';
import * as gate from '../actions/getGateStateForAddress';
import { OffKeyState, OffKeyViewHeaderConnected } from '../types';
import { OffKeyGate, OffKeyGateProps } from './OffKeyGate';

export const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

export function offKeyGateMocks({ gateState }: { gateState: OffKeyState }) {
  const mockgetGateStateForAddress = createMock(gate, 'getGateStateForAddress');
  mockgetGateStateForAddress.mockReturnValue(Promise.resolve(gateState));
  return [
    mockgetGateStateForAddress,
    ...authMocks({
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
  ];
}

export function OffKeyGateDemo(props: OffKeyGateProps) {
  return (
    <OffKeyLayout
      header={
        <OffKeyHeaderConnectedExamples
          viewType={OffKeyViewHeaderConnected.Default}
        />
      }
    >
      <OffKeyGate className="flex-1 pt-2" {...props} />
    </OffKeyLayout>
  );
}
