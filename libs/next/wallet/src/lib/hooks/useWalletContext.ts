import { useContext } from 'react';
import { WalletContext } from '../services/context';

export function useWalletContext() {
  const {
    wallet,
    setWallet,
    provider,
    setProvider,
    walletAdaptor,
    setWalletAdaptor,
    walletConnected,
    walletInStorage,
    setWalletInStorage,
    setWalletConnected,
  } = useContext(WalletContext);
  return {
    wallet,
    setWallet,
    provider,
    setProvider,
    walletAdaptor,
    setWalletAdaptor,
    walletConnected,
    walletInStorage,
    setWalletInStorage,
    setWalletConnected,
  };
}
