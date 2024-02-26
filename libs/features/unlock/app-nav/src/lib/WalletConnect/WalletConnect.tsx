'use client';
import { AppUser } from '@next/types';
import { useWalletConnect } from '@next/wallet';
import { Button, Input } from '@ui/components';
import { useEffect, useState } from 'react';

export interface WalletConnectProps extends Pick<AppUser, 'address'> {
  wcUri?: string;
}

// Test with https://react-app.walletconnect.com
export function WalletConnect({ address, wcUri }: WalletConnectProps) {
  const {
    initializeWalletConnect,
    connectToWallet,
    isReady,
    loading,
    isLoadingApprove,
  } = useWalletConnect({ address });
  // Call initialize on component mount if necessary
  useEffect(() => {
    initializeWalletConnect();
  }, [initializeWalletConnect]);

  useEffect(() => {
    if (wcUri && isReady) {
      console.log('wcUri', wcUri, 'isReady', isReady);
      connectToWallet(wcUri);
    }
  }, [wcUri, isReady, connectToWallet]);

  const [uri, setUri] = useState('');

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-3xl font-bold">Connect to WalletConnect</h2>
      <div>
        <p>isReady: {isReady ? 'true' : 'false'}</p>
        <p>loading: {loading ? 'true' : 'false'}</p>
        <p>isLoadingApprove: {isLoadingApprove ? 'true' : 'false'}</p>
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
