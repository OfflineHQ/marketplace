'use client';
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from '@cometh/connect-sdk';
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
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<ComethWallet | null>(null);
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
    } else {
      const keysInStorage = Object.keys(localStorage);
      for (const key of keysInStorage) {
        if (key.startsWith('cometh-connect')) {
          const keyParts = key.split('-');
          const address = keyParts[keyParts.length - 1];
          const storedItem = localStorage.getItem(key);
          let wallet: { name?: string } | null = null;
          if (storedItem && storedItem !== '') {
            wallet = JSON.parse(storedItem);
          }
          setWalletInStorage([{ address, name: wallet?.name || '' }]);
        } else if (key.startsWith('wallet-connected')) {
          const address = localStorage.getItem(key);
          setWalletConnected(address || '');
        }
      }
    }
  }, []);

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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
