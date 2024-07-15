'use client';

import { useIframeConnect } from '@next/iframe';
import { useWalletAuth } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ConnectProps } from '../OffKeyAuth/OffKeyAuthSignIn';
import { useShopifyCustomer } from './useShopifyCustomer';

export function useConnectWallet() {
  const [accountNotMatching, setAccountNotMatching] = useState(false);
  const { connect, wallet } = useWalletAuth();
  const { signWithEthereum } = useIframeConnect();
  const { customer } = useShopifyCustomer();

  const connectToDappMutation = useMutation({
    mutationFn: signWithEthereum,
    onSuccess: () => {
      console.log('Connected to dapp');
    },
    onError: (error: any) => {
      console.error('Error connecting to dapp:', error);
    },
  });

  const connectWalletMutation = useMutation({
    mutationFn: ({
      walletAddress,
      isCreatingAccount,
      walletToConnect,
    }: ConnectProps) =>
      connect(walletAddress, isCreatingAccount, walletToConnect),
    onSuccess: (address) => {
      console.log('Connected to wallet:', address);
    },
    onError: (error: Error) => {
      if (error.message.includes('Wallet address does not match')) {
        setAccountNotMatching(true);
      }
    },
  });

  useEffect(() => {
    if (wallet && customer?.id && connectToDappMutation.status === 'idle') {
      connectToDappMutation.mutate(customer.id);
    }
  }, [wallet, customer?.id, connectToDappMutation.status]);

  const retryConnectToDapp = () =>
    connectToDappMutation.mutate(customer?.id as string);

  return {
    connectWalletMutation,
    connectToDappMutation,
    retryConnectToDapp,
    accountNotMatching,
  };
}
