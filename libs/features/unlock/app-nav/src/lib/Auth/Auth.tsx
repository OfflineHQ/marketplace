'use client';

import { useWalletAuth, useWalletContext } from '@next/wallet';
import { Button } from '@ui/components';
import { LogIn, LogOut, SignUp } from '@ui/icons';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WalletConnect } from '../WalletConnect/WalletConnect';

export const Auth: React.FC = () => {
  const {
    connect,
    disconnect,
    isReady,
    isConnecting,
    isConnected,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const {
    walletConnected,
    walletInStorage,
    setWalletInStorage,
    setWalletConnected,
  } = useWalletContext();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const searchParams = useSearchParams();
  const wcUri = searchParams.get('wcUri');
  console.log('wcUri', wcUri);
  useEffect(() => {
    if (walletConnected && isReady && !wallet) {
      connect(walletConnected);
    }
  }, [walletConnected, isReady, wallet, connect]);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Auth</h1>
      <div>
        <p>Connecting: {isConnecting ? 'true' : 'false'}</p>
        <p>Wallet: {wallet ? wallet.getAddress() : 'false'}</p>
        <p>Verify Email: {isVerifyEmail ? 'true' : 'false'}</p>
      </div>
      {wallet ? (
        <>
          <WalletConnect
            address={wallet.getAddress()}
            wcUri={wcUri as string}
          />
          <Button
            onClick={disconnect}
            variant="secondary"
            icon={<LogOut />}
            block
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            icon={<LogIn />}
            isLoading={isConnecting || !isReady}
            onClick={() => connect('', false)}
            block
          >
            Login
          </Button>
          <Button
            isLoading={isConnecting || !isReady}
            onClick={() => connect('', true)}
            icon={<SignUp />}
            block
          >
            Create Account
          </Button>
        </>
      )}
    </div>
  );
};
