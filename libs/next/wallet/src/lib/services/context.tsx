'use client';
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from '@cometh/connect-sdk';
import { Dispatch, SetStateAction, createContext, useState } from 'react';

export const WalletContext = createContext<{
  wallet: ComethWallet | null;
  setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
  provider: ComethProvider | null;
  setProvider: Dispatch<SetStateAction<ComethProvider | null>>;
  walletAdaptor: ConnectAdaptor | null;
  setWalletAdaptor: Dispatch<SetStateAction<ConnectAdaptor | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  walletAdaptor: null,
  setWalletAdaptor: () => {},
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

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        walletAdaptor,
        setWalletAdaptor,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
