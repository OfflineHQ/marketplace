'use client';

// Imports
// ========================================================
import React from 'react';
import ClientOnly from './clientOnly';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getCsrfToken, signIn, useSession } from 'next-auth/react';

import { loginSiwe, logoutSiwe } from '@web/lib/safeAuthSetup';

import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';

import { useEffect, useState } from 'react';

// import { useSafeAuth } from '@web/lib/safeAuthSetup';

import { SafeThemeProvider, EthHashInfo } from '@safe-global/safe-react-components';

import { SafeEventEmitterProvider, type IWeb3Auth } from '@web3auth/base';

import { SafeAuthSignInData, Web3AuthEventListener } from '@web/lib/safe';

import { useAuthContext } from '@web/lib/providers';
import { User } from 'next-auth';

interface WalletProps {
  user?: User;
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

  const { safeAuth, web3AuthAdapter } = useAuthContext();

  const login = async () => {
    if (!safeAuth) return;
    try {
      const response = await safeAuth.signIn();
      console.log('SIGN IN RESPONSE: ', response);
      const safeAuthProvider = safeAuth?.getProvider();
      console.log('safeAuthProvider', safeAuthProvider, safeAuth);
      if (safeAuthProvider) {
        const provider = new ethers.providers.Web3Provider(safeAuthProvider);
        const signer = provider.getSigner();
        await loginSiwe(signer);
      }
    } catch (error) {
      console.error(error);
      await logout();
    }
  };

  const logout = async () => {
    if (!safeAuth) return;
    await safeAuth.signOut();
    await logoutSiwe();
  };

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
              Wallet Address Connected {user?.address}
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
