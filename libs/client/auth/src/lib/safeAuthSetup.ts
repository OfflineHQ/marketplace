'use client';
// safeAuthSetup.ts
import { useEffect, useState, useCallback } from 'react';
import { useDarkMode } from '@ui/hooks';
import { useToast } from '@ui/components';
import {
  SafeAuthKit,
  SafeAuthSignInData,
  SafeGetUserInfoResponse,
  Web3AuthModalPack,
  Web3AuthEventListener,
} from '@client/safe/auth';

import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3AuthOptions } from '@web3auth/modal';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  SafeEventEmitterProvider,
} from '@web3auth/base';
import { LOGIN_MODAL_EVENTS } from '@web3auth/ui';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { signIn, signOut, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { getCurrentUser } from '@web/lib/session';

import { logger } from '@logger';
import { isCypressRunning, checkCookie } from '@utils';
import { nextAuthCookieName } from '@client/next-auth/common';

type ChainConfig = Web3AuthOptions['chainConfig'] & {
  safeTxServiceUrl?: string;
};

const chainConfigs: Record<string, ChainConfig> = {
  goerli: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget:
      'https://eth-goerli.g.alchemy.com/v2/XGWYfxudDv5ACSpZegVCjkgSrskOpG3v',
    chainId: '0x5',
    displayName: 'Ethereum Goerli',
    blockExplorer: 'https://goerli.etherscan.io/',
    ticker: 'ETH',
    tickerName: 'GETH',
    safeTxServiceUrl: 'https://safe-transaction-goerli.safe.global',
    decimals: 18,
  },
  // Add other chains here
};

const { safeTxServiceUrl, chainId, ...chainConfig } = (chainConfigs[
  process.env.NEXT_PUBLIC_CHAIN as string
] || chainConfigs.goerli) as ChainConfig; // Default to goerli if no matching config

logger.debug('CHAIN CONFIG: ', chainConfig);

export interface SafeUser
  extends SafeGetUserInfoResponse<Web3AuthModalPack>,
    SafeAuthSignInData {}

export function useSafeAuth() {
  const [safeAuth, setSafeAuth] = useState<SafeAuthKit<Web3AuthModalPack>>();
  const [safeUser, setSafeUser] = useState<SafeUser>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [connecting, setConnecting] = useState(false);
  const isDark = useDarkMode();
  const { toast } = useToast();
  const router = useRouter();

  const web3AuthErrorHandler = useCallback((error: any) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (error?.message) {
      case 'user closed popup':
        toast({
          title: 'Sign in error',
          description:
            'The connection to the login provider was closed. Please try again.',
        });
        break;
      default:
        console.error({ error });
        break;
    }
  }, []);
  const logoutSiwe = useCallback(
    async ({ refresh }: { refresh?: boolean }) => {
      await signOut({ redirect: false });
      if (refresh) router.refresh();
    },
    [router]
  );

  const logout = useCallback(
    async ({ refresh }: { refresh?: boolean }) => {
      if (!safeAuth) return;

      await safeAuth.signOut();
      await logoutSiwe({ refresh });

      setProvider(null);
      setSafeUser(undefined);
    },
    [safeAuth, logoutSiwe]
  );

  const setupUserSession = useCallback(async () => {
    if (!safeAuth) return;
    // avoid running this function if cypress is running because it will fail
    const userInfo = !isCypressRunning() ? await safeAuth.getUserInfo() : {};
    // here mean the page have been refreshed, so we need to get the safeAuthData again
    if (!safeAuth.safeAuthData?.eoa) await safeAuth.getSafeAuthData();
    const _safeUser = {
      eoa: safeAuth.safeAuthData?.eoa || '',
      safes: safeAuth.safeAuthData?.safes || [],
      ...userInfo,
    } satisfies SafeUser;
    console.log('Safe User: ', _safeUser);
    setSafeUser(_safeUser);
  }, [safeAuth]);

  // signin with siwe to provide a JWT through next-auth
  const loginSiwe = useCallback(
    async (signer: ethers.Signer) => {
      try {
        // don't run this function if cypress is running, cannot mock the signature so directly provide the cookie instead
        if (isCypressRunning()) return;
        const address = await signer.getAddress();
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId: parseInt(chainId as string),
          nonce: await getCsrfToken(),
        });
        const signature = await signer?.signMessage(message.prepareMessage());
        const signInRes = await signIn('credentials', {
          message: JSON.stringify(message),
          redirect: false,
          signature,
        });
        if (signInRes?.error) {
          console.error('Error signing in with SIWE:', signInRes?.error);
          toast({
            variant: 'destructive',
            title: 'Error signing in with your wallet',
            description:
              'Something went wrong with the signature. Please try again or contact the support if its still failing.',
          });
        } else router.refresh();
      } catch (error) {
        toast({
          title: 'Signature declined',
          description:
            'You either declined or the signature failed. Please try again.',
        });
        await logout({ refresh: false });
      }
    },
    [toast, logout, router]
  );

  const login = useCallback(async () => {
    if (!safeAuth) return;

    try {
      let modalVisibleResolve: any,
        modalClosedResolved: any,
        connectedResolved: any;
      // used to detect when the modal is closed during the login process
      const modalVisibilityChanged = new Promise((resolve, _) => {
        modalVisibleResolve = resolve;
      }).then(() => {
        return new Promise((resolve, _) => (modalClosedResolved = resolve));
      });

      const isConnected = new Promise((resolve, _) => {
        connectedResolved = resolve;
      });

      const web3AuthModalVisibilityHandler = (isVisible: boolean) => {
        if (isVisible) {
          modalVisibleResolve();
        } else {
          modalClosedResolved();
        }
      };

      const web3AuthConnectedHandler = () => {
        connectedResolved('connected');
      };

      safeAuth.subscribe(
        LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
        web3AuthModalVisibilityHandler
      );

      safeAuth.subscribe(ADAPTER_EVENTS.CONNECTED, web3AuthConnectedHandler);

      // launch in background the modal with web3auth
      safeAuth.signIn();

      // here will determine if the user close the modal or not
      // if the user close the modal, web3AuthModalVisibilityHandler will be resolved before
      // if the user sign in, web3AuthConnectedHandler will be resolved before
      const raceResult = await Promise.race([
        isConnected,
        modalVisibilityChanged,
      ]);

      console.log({ raceResult });

      // if the user sign in, we want to set the provider
      if (raceResult === 'connected') {
        // used to force signIn in case the user denied the connection
        await safeAuth.signIn();
        console.log('signIn: ', { safeAuth });
        setProvider(safeAuth.getProvider() as SafeEventEmitterProvider);
      }

      safeAuth.unsubscribe(
        LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
        web3AuthModalVisibilityHandler
      );

      safeAuth.unsubscribe(ADAPTER_EVENTS.CONNECTED, web3AuthConnectedHandler);
    } catch (error) {
      console.warn({ error });
    }
  }, [safeAuth]);

  // when the provider (wallet) is connected, login to siwe or bypass if cookie is present
  useEffect(() => {
    (async () => {
      console.log('PROVIDER: ', provider);
      if (provider) {
        // not working because don't get this cookie on the client side.
        if (!checkCookie(nextAuthCookieName())) {
          const web3Provider = new ethers.providers.Web3Provider(provider);
          const signer = web3Provider.getSigner();
          await loginSiwe(signer);
        }
        await setupUserSession();
      }
    })();
  }, [provider, loginSiwe]);

  useEffect(() => {
    (async () => {
      console.log('setting safeAuthKit');
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          ...chainConfig,
          chainId,
        },
        uiConfig: {
          // defaultLanguage: 'de', // todo add language
          appLogo: isDark ? './logo-light.svg' : './logo-dark.svg',
          theme: isDark ? 'dark' : 'light',
          loginMethodsOrder: [
            'google',
            'twitter',
            'apple',
            'facebook',
            'discord',
            'reddit',
            'twitch',
            'line',
            'github',
            'kakao',
            'linkedin',
            'weibo',
            'wechat',
            'email_passwordless',
          ],
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'default',
          sessionTime:
            parseInt(process.env.TOKEN_LIFE_TIME as string) ||
            30 * 24 * 60 * 60, // 30 days,
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            // TODO adapt here with Offline branding, https://web3auth.io/docs/sdk/web/openlogin#whitelabel
            name: 'Offline',
            logoLight: './logo-dark.svg',
            logoDark: './logo-light.svg',
            dark: isDark,
            // defaultLanguage: 'de', // todo add language
          },
        },
      });

      const web3AuthModalPack = new Web3AuthModalPack(
        options,
        [openloginAdapter],
        modalConfig
      );

      const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack, {
        txServiceUrl: safeTxServiceUrl,
      });

      setSafeAuth(safeAuthKit);

      const safeProvider: SafeEventEmitterProvider | null =
        safeAuthKit.getProvider() as SafeEventEmitterProvider;
      // if the provider is set, mean the user is already connected to web3auth
      // otherwise we deconnect the user from next auth if he is connected to sync the state with web3auth
      if (safeProvider) setProvider(safeProvider);
      else logoutSiwe({ refresh: false });
      console.log({ initProvider: safeProvider });

      safeAuthKit.subscribe(ADAPTER_EVENTS.ERRORED, web3AuthErrorHandler);
      // safeAuthKit.subscribe(ADAPTER_EVENTS.ADAPTER_DATA_UPDATED, () => {
      //   console.log('ADAPTER_DATA_UPDATED');
      // });
      safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTING, () =>
        setConnecting(true)
      );
      return () => {
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.ERRORED, web3AuthErrorHandler);
      };
    })();
    // IMPORTANT: keep only isDark in the dependency array, otherwise it could create an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return {
    safeAuth,
    safeUser,
    provider,
    login,
    logout,
    loginSiwe,
    logoutSiwe,
  };
}
