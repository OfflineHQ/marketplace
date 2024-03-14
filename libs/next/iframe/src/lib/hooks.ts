'use client';

import { useWalletAuth } from '@next/wallet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IFramePage } from 'iframe-resizer';
import {
  ConnectStatus,
  ReceiveMessageType,
  SendMessageType,
  SendMessageValues,
} from './types';

export const useParentIFrame = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<IFramePage>(['parentIFrame']);
};

export interface IFrameChildMessage<T extends SendMessageType> {
  type: T;
  value: SendMessageValues[T];
}

export const useIframeConnect = () => {
  const iframe = useParentIFrame();
  const { wallet } = useWalletAuth();
  const queryClient = useQueryClient();

  const { data: connectStatus } = useQuery<ConnectStatus>({
    queryKey: [ReceiveMessageType.CONNECT_STATUS, wallet?.getAddress()],
  });

  const disconnectFromDapp = (address: string) => {
    if (!iframe) {
      console.warn(
        'Cannot send disconnect message to Dapp, iframe parent not found',
      );
      return;
    }
    iframe?.sendMessage({
      type: SendMessageType.DISCONNECT,
      value: { address },
    } satisfies IFrameChildMessage<SendMessageType.DISCONNECT>);
  };

  const signWithEthereum = async () => {
    if (!iframe) {
      throw new Error(
        'Cannot send signature message to Dapp, iframe parent not found',
      );
    }
    if (!wallet) {
      throw new Error('Cannot sign message, wallet not found');
    }
    try {
      const address = wallet.getAddress();
      queryClient.setQueryData(
        [ReceiveMessageType.CONNECT_STATUS, address],
        ConnectStatus.CONNECTING,
      );
      const message = 'Offline';
      const signature = await wallet.signMessage(message);
      iframe?.sendMessage({
        type: SendMessageType.SIGNATURE,
        value: { address, message, signature },
      } satisfies IFrameChildMessage<SendMessageType.SIGNATURE>);
    } catch (e) {
      const address = wallet.getAddress();
      queryClient.setQueryData(
        [ReceiveMessageType.CONNECT_STATUS, address],
        ConnectStatus.ERROR,
      );
      console.error('Error signing message with wallet:', e);
      // if (connectStatus === ConnectStatus.CONNECTING)
      throw e;
    }
  };

  return { connectStatus, disconnectFromDapp, signWithEthereum };
};
