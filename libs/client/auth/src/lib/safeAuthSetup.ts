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
// import { getCurrentUser } from '@web/lib/session';

import { logger } from '@logger';

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
  const isDark = useDarkMode();
  const { toast } = useToast();

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

  // const web3AuthModalVisibilityHandler = useCallback(
  //   (visible: boolean) => visible,
  //   []
  // );

  const logoutSiwe = useCallback(async () => {
    return signOut({ redirect: false });
  }, []);

  const logout = useCallback(async () => {
    if (!safeAuth) return;

    await safeAuth.signOut();
    await logoutSiwe();

    setProvider(null);
    setSafeUser(undefined);
  }, [safeAuth, logoutSiwe]);

  const setupUserSession = useCallback(async () => {
    if (!safeAuth) return;
    const userInfo = await safeAuth.getUserInfo();
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
        // setSiweLoading(true);
        console.log('loginSiwe with signer: ', signer);
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
        logger.debug({ message, signature });
        const signInRes = await signIn('credentials', {
          message: JSON.stringify(message),
          redirect: false,
          signature,
        });
        console.log({ signInRes });
        await setupUserSession();
        if (signInRes?.error) {
          console.error('Error signing in with SIWE:', signInRes?.error);
          toast({
            variant: 'destructive',
            title: 'Error signing in with your wallet',
            description:
              'Something went wrong with the signature. Please try again or contact the support if its still failing.',
          });
          // TODO handle error, show toast
        }
      } catch (error) {
        toast({
          title: 'Signature declined',
          description:
            'You either declined or the signature failed. Please try again.',
        });
        // TODO handle error, show toast saying signature rejected or failed
        await logout();
      }
    },
    [setupUserSession, toast, logout]
  );

  // used to stop execution of login function if user closes modal
  const observeModalElement = async () => {
    let resolveModalAppeared: any;
    const modalAppeared = new Promise((resolve) => {
      resolveModalAppeared = resolve;
    });

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const modalElement = document.getElementById('w3a-modal');
          if (modalElement) {
            resolveModalAppeared();
            observer.disconnect();
          }
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true });
    await modalAppeared;

    return new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const modalElement = document.getElementById('w3a-modal');
            if (!modalElement) {
              reject('Modal closed');
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(document, { childList: true, subtree: true });
    });
  };

  const login = useCallback(async () => {
    if (!safeAuth) return;

    try {
      let modalVisibleResolve: any, modalClosedResolved: any;
      // used to detect when the modal is closed during the login process
      const modalVisibilityChanged = new Promise((resolve, _) => {
        modalVisibleResolve = resolve;
      }).then(() => {
        return new Promise((resolve, _) => (modalClosedResolved = resolve));
      });

      const web3AuthModalVisibilityHandler = (isVisible: boolean) => {
        if (isVisible) {
          modalVisibleResolve();
        } else {
          modalClosedResolved();
        }
      };

      safeAuth.subscribe(
        LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
        web3AuthModalVisibilityHandler
      );

      // here will determine if the user close the modal or not
      // if the user close the modal, web3AuthModalVisibilityHandler will be resolved before
      const raceResult = await Promise.race([
        safeAuth.signIn().then(() => {
          safeAuth.unsubscribe(
            LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
            web3AuthModalVisibilityHandler
          );
          return 'signIn';
        }),
        modalVisibilityChanged,
      ]);

      // if the user sign in, we want to set the provider
      if (raceResult === 'signIn') {
        setProvider(safeAuth.getProvider() as SafeEventEmitterProvider);
      }
    } catch (error) {
      console.warn({ error });
    }
  }, [safeAuth]);

  // when the provider (wallet) is connected, login to siwe or bypass if cookie is present
  useEffect(() => {
    (async () => {
      console.log('PROVIDER: ', provider);
      if (provider) {
        // TODO set back when next fix issue: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server.edge'
        // const nextAuthUser = await getCurrentUser();
        // if (!nextAuthUser) {
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        await loginSiwe(signer);
        // }
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

      safeAuthKit.subscribe(ADAPTER_EVENTS.ERRORED, web3AuthErrorHandler);

      // safeAuthKit.subscribe(
      //   LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
      //   web3AuthModalVisibilityHandler
      // );

      setSafeAuth(safeAuthKit);

      setProvider(safeAuthKit.getProvider() as SafeEventEmitterProvider);

      return () => {
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.ERRORED, web3AuthErrorHandler);
        // safeAuthKit.unsubscribe(
        //   LOGIN_MODAL_EVENTS.MODAL_VISIBILITY,
        //   web3AuthModalVisibilityHandler
        // );
      };
    })();
    // IMPORTANT: keep only isDark in the dependency array, otherwise it will create an infinite loop
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
