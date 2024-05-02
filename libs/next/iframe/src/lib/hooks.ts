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

  const connectToShopify = () => {
    if (!iframeParent) {
      console.warn(
        'Cannot send connect to Shopify message to Dapp, iframe parent not found',
      );
      return;
    }
    iframeParent?.sendMessage({
      type: SendMessageType.CONNECT_TO_SHOPIFY,
      value: null,
    } satisfies IFrameChildMessage<SendMessageType.CONNECT_TO_SHOPIFY>);
  };

  const signWithEthereum = async (messageToSign: string) => {
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
      const signature = await wallet.signMessage(messageToSign);
      iframeParent?.sendMessage({
        type: SendMessageType.SIGNATURE,
        value: { address, message: messageToSign, signature },
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
    connectToShopify,
    disconnectFromDapp,
    signWithEthereum,
    askForWalletConnectStatus,
  };
};

// Here we rely on uiReady to determine if the iframe has been set (here means the iframe received css settings from the parent)
export const useIframeReady = () => {
  const { uiReady } = useIFrame();
  return uiReady;
};

export const useIframeOffKey = () => {
  const { offKeyState, customer, product, iframeParent, linkedCustomer } =
    useIFrame();
  const isIframeReady = useIframeReady();

  return {
    offKeyState,
    customer,
    product,
    isReady: isIframeReady,
    linkedCustomer,
  };
};
