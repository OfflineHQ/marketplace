'use client';
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from '@cometh/connect-sdk';
import { useSearchParams } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

export interface StorageWallet {
  address: string;
  name?: string;
}

export const WalletContext = createContext<{
  wallet: ComethWallet | null;
  setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
  provider: ComethProvider | null;
  setProvider: Dispatch<SetStateAction<ComethProvider | null>>;
  walletAdaptor: ConnectAdaptor | null;
  setWalletAdaptor: Dispatch<SetStateAction<ConnectAdaptor | null>>;
  walletInStorage: StorageWallet[] | null;
  setWalletInStorage: Dispatch<SetStateAction<StorageWallet[] | null>>;
  walletConnected: string;
  setWalletConnected: Dispatch<SetStateAction<string>>;
  wcUri: string | null;
  autoConnectAddress: string | null;
  setAutoConnectAddress: Dispatch<SetStateAction<string | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  walletAdaptor: null,
  setWalletAdaptor: () => {},
  walletInStorage: null,
  setWalletInStorage: () => {},
  walletConnected: '',
  setWalletConnected: () => {},
  wcUri: null,
  autoConnectAddress: null,
  setAutoConnectAddress: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const searchParams = useSearchParams();
  const [wallet, setWallet] = useState<ComethWallet | null>(null);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [autoConnectAddress, setAutoConnectAddress] = useState<string | null>(
    null,
  );
  const [provider, setProvider] = useState<ComethProvider | null>(null);
  const [walletAdaptor, setWalletAdaptor] = useState<ConnectAdaptor | null>(
    null,
  );
  const [walletInStorage, setWalletInStorage] = useState<
    StorageWallet[] | null
  >(null);

  const [walletConnected, setWalletConnected] = useState<string>('');

  useEffect(() => {
    if (!localStorage) {
      return;
    }

    const currentWalletsInStorage = walletInStorage || [];
    const updatedWallets = [...currentWalletsInStorage]; // Create a shallow copy of the current state

    let newWalletConnected = walletConnected;
    let updateWalletConnected = false;

    const keysInStorage = Object.keys(localStorage);
    for (const key of keysInStorage) {
      if (key.startsWith('cometh-connect')) {
        const keyParts = key.split('-');
        const address = keyParts[keyParts.length - 1];
        const storedItem = localStorage.getItem(key);
        let wallet: StorageWallet | null = null;
        if (storedItem && storedItem !== '') {
          wallet = JSON.parse(storedItem);
        }
        // Check if the address already exists in the current state
        if (!updatedWallets.some((w) => w.address === address)) {
          updatedWallets.push({ address, name: wallet?.name || '' });
        }
      } else if (key.startsWith('wallet-connected')) {
        const address = localStorage.getItem(key) || '';
        if (newWalletConnected !== address) {
          newWalletConnected = address;
          updateWalletConnected = true;
        }
      }
    }

    // Only update the state if there are new wallets to add
    if (
      JSON.stringify(currentWalletsInStorage) !== JSON.stringify(updatedWallets)
    ) {
      setWalletInStorage(updatedWallets);
    }

    // Update walletConnected if it has changed
    if (updateWalletConnected) {
      setWalletConnected(newWalletConnected);
    }
  }, [walletInStorage, walletConnected]);

  useEffect(() => {
    const resWc = searchParams?.get('wcUri') || null;
    if (resWc !== wcUri) {
      setWcUri(resWc);
    }
    if (!walletInStorage) return;
    const resConnectAddress = searchParams?.get('address') || null;
    if (
      resConnectAddress &&
      resConnectAddress !== '' &&
      !walletInStorage?.find((w) => w.address === resConnectAddress)
    ) {
      console.warn(`Address "${resConnectAddress}" not found in storage`);
      setAutoConnectAddress('');
    } else if (resConnectAddress !== autoConnectAddress) {
      setAutoConnectAddress(resConnectAddress);
    }
  }, [autoConnectAddress, searchParams, walletInStorage, wcUri]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        walletAdaptor,
        setWalletAdaptor,
        walletInStorage,
        setWalletInStorage,
        walletConnected,
        setWalletConnected,
        wcUri,
        autoConnectAddress,
        setAutoConnectAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
