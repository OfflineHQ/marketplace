'use client';

// Imports
// ========================================================
import React from 'react';
import ClientOnly from './clientOnly';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getCsrfToken, signIn, useSession } from 'next-auth/react';

import { useEffect, useState } from 'react';

import { SafeEventEmitterProvider, type IWeb3Auth } from '@web3auth/base';

import { SafeAuthSignInData, Web3AuthEventListener } from '@web/lib/safe';

import { useAuthContext, type SafeUser } from '@web/lib/providers';

interface WalletProps {
  user: SafeUser;
}
// Page
// ========================================================
export default function Wallet({ user }: WalletProps) {
  // State / Props

  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<SafeAuthSignInData | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  // const [wagmiClient, setWagmiClient] = useState<any | null>(null);

  // const connectedHandler: Web3AuthEventListener = async (data) => {
  //   console.log({ data });
  //   console.log('CONNECTED', data);
  // };
  // const disconnectedHandler: Web3AuthEventListener = (data) =>
  //   console.log('DISCONNECTED', data);

  // const { safeAuth, web3AuthAdapter } = useSafeAuth(
  //   connectedHandler,
  //   disconnectedHandler
  // );

  const { login, logout } = useAuthContext();

  // const handleLogin = async () => {
  //   try {
  //     const callbackUrl = '/protected';
  //     const message = new SiweMessage({
  //       domain: window.location.host,
  //       address: address,
  //       statement: 'Sign in with Ethereum to the app.',
  //       uri: window.location.origin,
  //       version: '1',
  //       chainId: chain?.id,
  //       nonce: await getCsrfToken(),
  //     });
  //     const signature = await signMessageAsync({
  //       message: message.prepareMessage(),
  //     });
  //     signIn('credentials', {
  //       message: JSON.stringify(message),
  //       redirect: false,
  //       signature,
  //       callbackUrl,
  //     });
  //   } catch (error) {
  //     window.alert(error);
  //   }
  // };

  // useEffect(() => {
  //   console.log(isConnected);
  //   if (isConnected && !session) {
  //     handleLogin();
  //   }
  // }, [isConnected]);

  // Render
  return (
    <div>
      <ClientOnly>
        {!user ? (
          <div>
            <button
              className="h-10 rounded-full bg-blue-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-blue-800"
              onClick={login} // connect()
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-zinc-400">
              Wallet Address Connected {user?.eoa}
            </label>
            <code className="mb-4 block rounded bg-zinc-700 p-4 text-zinc-200">
              <pre>{address}</pre>
            </code>
            <button
              className="h-10 rounded-full bg-red-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-red-800"
              onClick={logout}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}
