'use client';

import { useAuthContext } from '@next/auth';
import { useStorageWallet, useWalletContext } from '@next/wallet';
import { Button } from '@ui/components';
import { LogIn, LogOut, SignUp } from '@ui/icons';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { WalletConnect } from '../WalletConnect/WalletConnect';

export const Auth: React.FC = () => {
  const { data: session } = useSession();
  const { login, logout, createAccount, connecting } = useAuthContext();
  const { wallet } = useWalletContext();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const { comethWalletAddressInStorage } = useStorageWallet();
  const searchParams = useSearchParams();
  const wcUri = searchParams.get('wcUri');
  console.log('comethWalletAddressInStorage', comethWalletAddressInStorage);
  console.log('session', session);
  console.log('wcUri', wcUri);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Auth</h1>
      <div>
        <p>Connecting: {connecting ? 'true' : 'false'}</p>
        <p>Session: {session ? session.user.address : 'false'}</p>
        <p>Wallet: {wallet ? 'true' : 'false'}</p>
        <p>Verify Email: {isVerifyEmail ? 'true' : 'false'}</p>
      </div>
      {session ? (
        <>
          <WalletConnect
            address={session.user.address}
            wcUri={wcUri as string}
          />
          <Button
            onClick={() => logout({ refresh: false })}
            variant="secondary"
            icon={<LogOut />}
            block
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="secondary" icon={<LogIn />} onClick={login} block>
            Login
          </Button>
          <Button onClick={createAccount} icon={<SignUp />} block>
            Create Account
          </Button>
        </>
      )}
    </div>
  );
};
