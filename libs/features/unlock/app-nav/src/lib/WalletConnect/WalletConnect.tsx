'use client';
import { AppUser } from '@next/types';
import { useWalletConnect } from '@next/wallet';
import { useEffect } from 'react';

export interface WalletConnectProps extends Pick<AppUser, 'address'> {
  wcUri?: string;
}

// Test with https://react-app.walletconnect.com
export function WalletConnect({ address, wcUri }: WalletConnectProps) {
  const {
    initializeWalletConnect,
    connectToDapp,
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
      connectToDapp(wcUri);
    }
  }, [wcUri, isReady, connectToDapp]);

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-bold">WalletConnect</h3>
      <div>
        <p>loading: {loading ? 'true' : 'false'}</p>
        <p>isLoadingApprove: {isLoadingApprove ? 'true' : 'false'}</p>
      </div>
    </div>
  );
}
