'use client';
import { AppUser } from '@next/types';
import { useWalletConnect } from '@next/wallet';
import { Button, Input } from '@ui/components';
import { useEffect, useState } from 'react';

export type WalletConnectProps = Pick<AppUser, 'address'>;

export function WalletConnect({ address }: WalletConnectProps) {
  const {
    initializeWalletConnect,
    connectToWallet,
    loading,
    isLoadingApprove,
  } = useWalletConnect(address);
  const [uri, setUri] = useState('');
  // Call initialize on component mount if necessary
  useEffect(() => {
    initializeWalletConnect();
  }, [initializeWalletConnect]);

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-bold">Connect to WalletConnect</p>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter your WalletConnect URI"
          className="w-full"
          onInput={(e) => setUri(e.currentTarget.value)}
        />
        <Button onClick={() => connectToWallet(uri)}>
          Connect to WC {(loading || isLoadingApprove) && 'is loading...'}
        </Button>
      </div>
    </div>
  );
}
