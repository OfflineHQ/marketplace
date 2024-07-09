'use client';

import { useWalletAuth } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ConnectProps } from '../OffKeyAuth/OffKeyAuthSignIn';

export function useConnectWallet() {
  const [accountNotMatching, setAccountNotMatching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { connect } = useWalletAuth();

  const connectWalletMutation = useMutation({
    mutationFn: ({
      walletAddress,
      isCreatingAccount,
      walletToConnect,
    }: ConnectProps) =>
      connect(walletAddress, isCreatingAccount, walletToConnect),
    onSuccess: (address) => {
      let url = `${pathname}/${address}`;
      if (searchParams?.toString()) {
        const params = new URLSearchParams(searchParams.toString());
        url += `?${params.toString()}`;
      }
      router.replace(url);
    },
    onError: (error: Error) => {
      if (error.message.includes('Wallet address does not match')) {
        setAccountNotMatching(true);
      }
    },
  });

  return {
    connectWalletMutation,
    accountNotMatching,
  };
}
