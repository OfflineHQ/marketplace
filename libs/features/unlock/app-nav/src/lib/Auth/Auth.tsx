'use client';

import { useWalletAuth, useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { BlockchainAddress, Button } from '@ui/components';
import { LogIn, LogOut, SignUp } from '@ui/icons';
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
  const { walletConnected, wcUri, autoConnectAddress } = useWalletContext();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const connectWalletMutation = useMutation({
    mutationFn: (newWallet: string) => connect(newWallet),
    onSuccess: () => {
      // Handle successful connection
    },
    onError: (error: any) => {
      // Handle connection error
    },
  });
  console.log({ wallet });

  useEffect(() => {
    console.log({
      autoConnectAddress,
      walletConnected,
    });
    const walletToConnect = autoConnectAddress || walletConnected;
    if (
      walletToConnect &&
      isReady &&
      !wallet &&
      !!(connectWalletMutation.status !== 'pending')
    ) {
      connectWalletMutation.mutate(walletToConnect);
    }
  }, [
    autoConnectAddress,
    walletConnected,
    isReady,
    wallet,
    connectWalletMutation,
  ]);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div>
        <p>Connecting: {isConnecting ? 'true' : 'false'}</p>
        <p>
          Wallet:{' '}
          {wallet ? (
            <BlockchainAddress
              variant="outline"
              address={wallet.getAddress()}
              copiedText={'Address Copied'}
            />
          ) : (
            'false'
          )}
        </p>
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
