'use client';

import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from '@cometh/connect-sdk';
import env from '@env/client';
import { getCurrentChain } from '@next/chains';
import { useEffect, useState } from 'react';
import { useWalletContext } from './useWalletContext';

export function useWalletAuth() {
  const {
    setWallet,
    provider,
    setProvider,
    wallet,
    walletAdaptor,
    setWalletAdaptor,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey = env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY;

  const [instance, setInstance] = useState<ComethWallet | null>(null);

  useEffect(() => {
    if (!apiKey) throw new Error('no apiKey provided');

    const newWalletAdaptor = new ConnectAdaptor({
      chainId: getCurrentChain().chainIdHex,
      apiKey,
      passKeyName: 'Offline',
    });

    const newInstance = new ComethWallet({
      authAdapter: newWalletAdaptor,
      apiKey,
    });

    setWalletAdaptor(newWalletAdaptor);
    setInstance(newInstance);
  }, []);

  async function connect(
    loginSiwe: (signer: ComethWallet) => void,
    address?: string,
    createAccount: boolean = false,
  ) {
    if (!instance || !walletAdaptor) return; // Ensure instance and walletAdaptor are initialized

    setIsConnecting(true);
    try {
      // got an address from next auth cookie so connect to wallet
      if (address) {
        await instance.connect(address);
      }
      // no address from next auth cookie so connect to wallet and create account in db
      else if (createAccount) {
        await instance.connect();
      }
      // no address from next auth cookie and not creating new account so ask user to choose account (passkey)
      else {
        const walletAddress =
          await walletAdaptor.retrieveWalletAddressFromSigner();
        await instance.connect(walletAddress);
      }

      const instanceProvider = new ComethProvider(instance);
      // next auth need to be connected through siwe
      if (!address) {
        await loginSiwe(instance);
      }

      setIsConnected(true);
      setWallet(instance);
      setProvider(instanceProvider);
    } catch (e) {
      setConnectionError((e as Error).message);
      throw e;
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    if (wallet) {
      try {
        await wallet!.logout();
        setIsConnected(false);
        setWallet(null);
        setProvider(null);
      } catch (e) {
        setConnectionError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    walletAdaptor,
    provider,
    connect,
    disconnect,
    isReady: !!walletAdaptor && !!instance,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
