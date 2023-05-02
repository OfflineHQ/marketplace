'use client';

// Imports
// ========================================================
import React from 'react';
import ClientOnly from './clientOnly';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getCsrfToken, signIn, useSession } from 'next-auth/react';

import { SiweMessage } from 'siwe';

import { useEffect, useState } from 'react';

// Page
// ========================================================
export default function Wallet() {
  // State / Props

  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected';
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    console.log(isConnected);
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

  // Render
  return (
    <div>
      <ClientOnly>
        {!isConnected ? (
          <div>
            <button
              className="h-10 rounded-full bg-blue-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-blue-800"
              onClick={() => connect()}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-zinc-400">
              Wallet Address Connected {session?.user.address}
            </label>
            <code className="mb-4 block rounded bg-zinc-700 p-4 text-zinc-200">
              <pre>{address}</pre>
            </code>
            <button
              className="h-10 rounded-full bg-red-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-red-800"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}
