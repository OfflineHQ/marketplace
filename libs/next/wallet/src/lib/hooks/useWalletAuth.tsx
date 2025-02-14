'use client';

import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from '@cometh/connect-sdk';
import env from '@env/client';
import { getCurrentChain } from '@next/chains';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWalletContext } from './useWalletContext';

export function useWalletAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    setWallet,
    provider,
    setProvider,
    wallet,
    walletAdaptor,
    setWalletAdaptor,
    setWalletConnected,
    setAutoConnectAddress,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey = env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY;

  const [instance, setInstance] = useState<ComethWallet | null>(null);

  useEffect(() => {
    if (!apiKey) throw new Error('no apiKey provided');

    const newWalletAdaptor = new ConnectAdaptor({
      chainId: getCurrentChain().chainIdHex,
      apiKey,
      passKeyName: 'Offline 🔑',
      disableEoaFallback: false,
      rpcUrl: getCurrentChain().urls[0],
    });

    const newInstance = new ComethWallet({
      authAdapter: newWalletAdaptor,
      apiKey,
    });

    setWalletAdaptor(newWalletAdaptor);
    setInstance(newInstance);
  }, []);

  async function connect(
    address?: string,
    createAccount?: boolean,
    walletToConnect?: string,
  ) {
    if (!instance || !walletAdaptor) return; // Ensure instance and walletAdaptor are initialized

    setIsConnecting(true);
    try {
      // got an address from useStorageWallet so connect to wallet
      if (address) {
        await instance.connect(address);
      }
      // user choose to create a new passkey/account
      else if (createAccount) {
        // see Transient activation https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/publickey-credentials-create
        if (!navigator || !navigator.userActivation.isActive) {
          throw new Error('User is not active');
        }
        await instance.connect();
      }
      // no address from useStorageWallet and not creating new account so ask user to choose existing account (passkey)
      else {
        const walletAddress =
          await walletAdaptor.retrieveWalletAddressFromSigner();
        if (walletToConnect && walletToConnect !== walletAddress) {
          throw new Error('Wallet address does not match the one to connect');
        } else await instance.connect(walletAddress);
      }
      const instanceProvider = new ComethProvider(instance);
      localStorage?.setItem('wallet-connected', instance.getAddress());
      setWallet(instance);
      setProvider(instanceProvider);
    } catch (e) {
      setConnectionError((e as Error).message);
      throw e;
    } finally {
      setIsConnecting(false);
    }
    return instance?.getAddress();
  }

  async function connectWithSiwe(
    loginSiwe: (signer: ComethWallet) => void,
    address?: string,
    createAccount = false,
  ) {
    console.log('connectWithSiwe:', {
      address,
      createAccount,
      instanceAndWalletReady: !!instance && !!walletAdaptor,
    });
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

      setWallet(instance);
      setProvider(instanceProvider);
      return instance;
    } catch (e) {
      console.error('Error connecting with SIWE:', e);
      setConnectionError((e as Error).message);
      throw e;
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    console.log('disconnect wallet:', { wallet });
    if (wallet) {
      try {
        await wallet!.logout();
        setWalletConnected('');
        // wallet-connected is used to auto-connect user when they visit the site again
        localStorage.removeItem('wallet-connected');
        setWallet(null);
        setProvider(null);
        setAutoConnectAddress(null);
        // Here if have an address to auto-connect we want to remove it if user choose to log out
        if (searchParams?.get('address')) {
          console.log('Removing address from URL');
          const current = new URLSearchParams(
            Array.from(searchParams.entries()),
          );
          current.delete('address');
          // cast to string
          const search = current.toString();
          const query = search ? `?${search}` : '';
          // Here don't know why but the `searchParams.get('address')` in Auth at first is populated and then not
          // refresh is not doing the trick
          await router.replace(`${pathname}${query}`);
          await router.refresh();
        }
      } catch (e) {
        setConnectionError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    walletAdaptor,
    provider,
    connectWithSiwe,
    connect,
    disconnect,
    isReady: !!walletAdaptor && !!instance,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
