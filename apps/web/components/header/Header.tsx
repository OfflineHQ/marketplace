'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

// import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react';
import { HeaderNav } from '@web/components/header-nav/HeaderNav';
import type { HeaderSettingsProps } from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';

// import { NextAuthProvider, SSXProvider } from '@web/lib/providers';

// import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
// import {
//   chain,
//   ChainDoesNotSupportMulticallError,
//   ChainProviderFn,
//   configureChains,
//   createClient,
//   WagmiConfig,
// } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { publicProvider } from 'wagmi/providers/public';
// import { InjectedConnector } from 'wagmi/connectors/injected';

import { useSafeAuth } from '@web/lib/safeAuthSetup';

import { SafeThemeProvider, EthHashInfo } from '@safe-global/safe-react-components';

import { SafeEventEmitterProvider, type IWeb3Auth } from '@web3auth/base';

import { SafeAuthSignInData, Web3AuthEventListener } from '@web/lib/safe';

// const web3_providers: ChainProviderFn[] = [publicProvider()];

// const testnetChains = [chain.goerli, chain.polygonMumbai];

// const {
//   chains,
//   provider: etherProvider,
//   webSocketProvider,
// } = configureChains([chain.mainnet, chain.polygon, ...testnetChains], web3_providers);

export default function Header() {
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<SafeAuthSignInData | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  // const [wagmiClient, setWagmiClient] = useState<any | null>(null);

  const connectedHandler: Web3AuthEventListener = async (data) => {
    console.log({ data });
    console.log('CONNECTED', data);
  };
  const disconnectedHandler: Web3AuthEventListener = (data) =>
    console.log('DISCONNECTED', data);

  const { safeAuth, web3AuthAdapter } = useSafeAuth(
    connectedHandler,
    disconnectedHandler
  );

  // // // Configure chains & providers with the Alchemy provider.
  // // // Popular providers are Alchemy (alchemy.com), Infura (infura.io), Quicknode (quicknode.com) etc.

  // useEffect(() => {
  //   if (web3AuthAdapter) {
  //     const wagmiClient = createClient({
  //       autoConnect: false,
  //       connectors: [
  //         new Web3AuthConnector({
  //           chains,
  //           options: {
  //             web3AuthInstance: web3AuthAdapter.web3authInstance as IWeb3Auth,
  //           },
  //         }),
  //         new InjectedConnector({
  //           chains,
  //           options: {
  //             name: 'Injected',
  //             shimDisconnect: true,
  //           },
  //         }),
  //       ],
  //       provider: etherProvider,
  //       webSocketProvider,
  //     });
  //     setWagmiClient(wagmiClient);
  //   }
  // }, [web3AuthAdapter]);

  const login = async () => {
    if (!safeAuth) return;
    try {
      const response = await safeAuth.signIn();
      console.log('SIGN IN RESPONSE: ', response);

      setSafeAuthSignInResponse(response);
      setProvider(safeAuth.getProvider() as SafeEventEmitterProvider);
    } catch (error) {
      console.error(error);
      await logout();
    }
  };

  const logout = async () => {
    if (!safeAuth) return;
    await safeAuth.signOut();
    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  const displayItems: HeaderSettingsProps['displays'] = [
    {
      type: 'item',
      text: 'Light',
      icon: <Light />,
      disabled: true,
    },
    {
      type: 'item',
      text: 'Dark',
      icon: <Dark />,
    },
    {
      type: 'item',
      text: 'Automatic',
      icon: <DarkLight />,
    },
  ];

  const languages: HeaderSettingsProps['languages'] = [
    {
      type: 'item',
      text: 'English',
      icon: <Check />,
      disabled: true,
    },
    {
      type: 'item',
      text: 'Français',
    },
  ];

  const languageText = 'Language';
  const languageHelperText = 'Select your language';
  const displayText = 'Display mode';
  const displayHelperText = 'Select a display mode';

  const [sessionLoading, setSessionLoading] = useState(false);

  const lastWagmiClientRef = useRef<any | null>(null);

  // const { data: session } = useSession();

  return (
    // <SafeThemeProvider mode="dark">
    //   {(safeTheme) => (
    <HeaderNav
      profileSections={[]}
      menuSections={[]}
      signIn={login}
      session={null}
      sessionLoading={sessionLoading || !safeAuth}
      settings={{
        languages,
        languageText,
        languageHelperText,
        displays: displayItems,
        displayText,
        displayHelperText,
      }}
    />
    //   )}
    // </SafeThemeProvider>
  );
}
