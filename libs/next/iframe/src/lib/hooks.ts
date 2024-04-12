'use client';

import { useWalletAuth } from '@next/wallet';
import { useIFrame } from './context';
import { ConnectStatus, SendMessageType, SendMessageValues } from './types';

export interface IFrameChildMessage<T extends SendMessageType> {
  type: T;
  value: SendMessageValues[T];
}

export const useIframeConnect = () => {
  const { iframeParent, connectStatus, setConnectStatus } = useIFrame();
  const { wallet } = useWalletAuth();

  const disconnectFromDapp = (address: string) => {
    if (!iframeParent) {
      console.warn(
        'Cannot send disconnect message to Dapp, iframe parent not found',
      );
      return;
    }
    iframeParent?.sendMessage({
      type: SendMessageType.DISCONNECT,
      value: { address },
    } satisfies IFrameChildMessage<SendMessageType.DISCONNECT>);
  };

  const signWithEthereum = async () => {
    if (!iframeParent) {
      throw new Error(
        'Cannot send signature message to Dapp, iframe parent not found',
      );
    }
    if (!wallet) {
      throw new Error('Cannot sign message, wallet not found');
    }
    try {
      setConnectStatus(ConnectStatus.CONNECTING);
      const address = wallet.getAddress();
      const message = 'Offline';
      const signature = await wallet.signMessage(message);
      iframeParent?.sendMessage({
        type: SendMessageType.SIGNATURE,
        value: { address, message, signature },
      } satisfies IFrameChildMessage<SendMessageType.SIGNATURE>);
    } catch (e) {
      setConnectStatus(ConnectStatus.ERROR);
      // if (connectStatus === ConnectStatus.CONNECTING)
      throw e;
    }
  };

  const askForWalletConnectStatus = () => {
    if (!iframeParent) {
      console.warn(
        'Cannot send connect status request to Dapp, iframe parent not found',
      );
      return;
    } else if (!wallet) {
      console.warn(
        'Cannot send connect status request to Dapp, wallet not found',
      );
      return;
    }
    console.log('asking for CONNECT_STATUS', { address: wallet.getAddress() });
    iframeParent?.sendMessage({
      type: SendMessageType.CONNECT_STATUS,
      value: { address: wallet.getAddress() },
    });
  };

  return {
    connectStatus,
    disconnectFromDapp,
    signWithEthereum,
    askForWalletConnectStatus,
  };
};

export const useIframeOffKey = () => {
  const { offKeyState } = useIFrame();

  return {
    offKeyState,
  };
};
