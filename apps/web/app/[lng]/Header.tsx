'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react';
import { HeaderNav } from '@web/components/header-nav/HeaderNav';
import type { HeaderSettingsProps } from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';

import { useSafeAuth } from '@web/lib/safeAuthSetup';

// import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
import {
  chain,
  ChainDoesNotSupportMulticallError,
  ChainProviderFn,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { SafeThemeProvider, EthHashInfo } from '@safe-global/safe-react-components';

import { SafeEventEmitterProvider } from '@web3auth/base';

import { SafeAuthSignInData, Web3AuthEventListener } from '@web/lib/safe';

import { useSSX } from '@spruceid/ssx-react';

const web3_providers: ChainProviderFn[] = [publicProvider()];

const testnetChains = [chain.goerli, chain.polygonMumbai];

const {
  chains,
  provider: etherProvider,
  webSocketProvider,
} = configureChains([chain.mainnet, chain.polygon, ...testnetChains], web3_providers);

export default function Header() {
  const { data: session, status } = useSession();
  const { ssx, ssxLoaded } = useSSX();

  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<SafeAuthSignInData | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  // // Configure chains & providers with the Alchemy provider.
  // // Popular providers are Alchemy (alchemy.com), Infura (infura.io), Quicknode (quicknode.com) etc.

  // useEffect(() => {
  //   const wagmiClient = createClient({
  //     autoConnect: false,
  //     connectors: [
  //       new Web3AuthConnector({
  //         chains,
  //         options: {
  //           web3AuthInstance: adapter.web3authInstance,
  //         },
  //       }),
  //       new InjectedConnector({
  //         chains,
  //         options: {
  //           name: 'Injected',
  //           shimDisconnect: true,
  //         },
  //       }),
  //     ],
  //     provider: etherProvider,
  //     webSocketProvider,
  //   });
  //   setWagmiConfig(wagmiClient);
  // }, [adapter]);

  const connectedHandler: Web3AuthEventListener = async (data) => {
    console.log({ data });
    console.log('CONNECTED', data);
  };
  const disconnectedHandler: Web3AuthEventListener = (data) =>
    console.log('DISCONNECTED', data);

  const safeAuth = useSafeAuth(connectedHandler, disconnectedHandler);

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

  return (
    // <WagmiConfig client={wagmiClient}>
    <SafeThemeProvider mode="dark">
      {(safeTheme) => (
        <HeaderNav
          profileSections={[]}
          menuSections={[]}
          signIn={login}
          session={session}
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
      )}
    </SafeThemeProvider>
    // </WagmiConfig>
  );
}
