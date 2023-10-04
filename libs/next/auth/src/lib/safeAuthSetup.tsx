'use client';
// safeAuthSetup.ts

import { AuthKitSignInData, Web3AuthModalPack } from '@next/safe/auth';
import { ToastAction, useToast } from '@ui/components';
import { getNextAppURL, isCypressRunning } from '@utils';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from '@next/navigation';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  UserInfo,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { LANGUAGE_TYPE, OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import { ExternalProvider } from '@ethersproject/providers';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

type ChainConfig = Web3AuthOptions['chainConfig'] & {
  safeTxServiceUrl?: string;
};

// safeTxServiceUrl: https://forum.safe.global/t/announcement-to-all-builders-using-safe-services/3225

const chainConfigs: Record<string, ChainConfig> = {
  '5': {
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
  '11155111': {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: 'https://eth-sepolia.g.alchemy.com/v2/OUR_API_KEY', // TODO add an alchemy app
    chainId: '0xaa36a7',
    displayName: 'Ethereum Sepolia',
    blockExplorer: 'https://sepolia.etherscan.io/',
    ticker: 'ETH',
    tickerName: 'SepoliaETH',
    safeTxServiceUrl: '', // not existing yet
    decimals: 18,
  },
  // Add other chains here
};

const { safeTxServiceUrl, chainId, ...chainConfig } = (chainConfigs[
  process.env.NEXT_PUBLIC_CHAIN as string
] || chainConfigs['5']) as ChainConfig; // Default to goerli if no matching config

export interface SafeUser extends Partial<UserInfo>, AuthKitSignInData {}

export interface UseSafeAuthProps {
  messages?: {
    userClosedPopup: {
      title: string;
      description: string;
    };
    siweStatement: string;
    errorSigningInWithSiwe: {
      title: string;
      description: string;
      tryAgainButton: string;
    };
    siweDeclined: {
      title: string;
      description: string;
      tryAgainButton: string;
    };
  };
}

export function useSafeAuth(props: UseSafeAuthProps = {}) {
  const [safeAuth, setSafeAuth] = useState<Web3AuthModalPack>();
  const [safeUser, setSafeUser] = useState<SafeUser>();
  const [provider, setProvider] = useState<ExternalProvider | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const messages = props.messages;

  const web3AuthErrorHandler = useCallback(
    (error: any) => {
      // eslint-disable-next-line sonarjs/no-small-switch
      if (error?.message?.includes('login popup has been closed by the user')) {
        if (messages?.userClosedPopup)
          toast({
            title: messages.userClosedPopup.title,
            description: messages.userClosedPopup.description,
            variant: 'destructive',
          });
        setConnecting(false);
      } else {
        console.error({ error });
      }
    },
    [messages?.userClosedPopup, toast]
  );

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

      setSafeUser(undefined);
      setLoggedIn(false);
    },
    [safeAuth, logoutSiwe]
  );

  const setupUserSession = useCallback(async () => {
    console.log({ safeAuth });
    if (!safeAuth) return;

    let userInfo: Partial<UserInfo> = {};
    if (!isCypressRunning()) userInfo = await safeAuth.getUserInfo();
    let eoa: AuthKitSignInData['eoa'] = safeUser?.eoa || '';
    let safes: AuthKitSignInData['safes'] = safeUser?.safes || [];
    // here mean the page have been refreshed, so we need to get the AuthKitSignInData again
    if (!eoa) {
      eoa = await safeAuth.getAddress();
      safes = await safeAuth.getSafes(safeTxServiceUrl || '');
    }
    const _safeUser = {
      eoa,
      safes,
      ...userInfo,
    } satisfies SafeUser;
    console.log('Safe User: ', _safeUser, userInfo);
    setSafeUser(_safeUser);
    setConnecting(false);
  }, [safeAuth]);

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
          setConnecting(false);
        }
      };

      const web3AuthConnectedHandler = () => {
        connectedResolved('connected');
      };

      safeAuth.subscribe('MODAL_VISIBILITY', web3AuthModalVisibilityHandler);

      safeAuth.subscribe(ADAPTER_EVENTS.CONNECTED, web3AuthConnectedHandler);

      // launch in background the modal with web3auth
      safeAuth.signIn().catch((_error) => null);

      // here will determine if the user close the modal or not
      // if the user close the modal, web3AuthModalVisibilityHandler will be resolved before
      // if the user sign in, web3AuthConnectedHandler will be resolved before
      const raceResult = await Promise.race([
        isConnected,
        modalVisibilityChanged,
      ]);

      console.log({ raceResult });

      // if the user sign in, we want to login with siwe
      if (raceResult === 'connected') {
        // used to force signIn in case the user denied the connection
        // await safeAuth.signIn();
        await finishLogin();
      }
      safeAuth.unsubscribe('MODAL_VISIBILITY', web3AuthModalVisibilityHandler);

      safeAuth.unsubscribe(ADAPTER_EVENTS.CONNECTED, web3AuthConnectedHandler);
    } catch (error) {
      console.warn({ error });
    }
  }, [safeAuth]);

  // signin with siwe to provide a JWT through next-auth
  const loginSiwe = useCallback(
    async (signer: ethers.Signer) => {
      try {
        // don't run this function if cypress is running, cannot mock the signature so directly provide the cookie instead
        if (isCypressRunning()) return;
        console.log('Signing in with SIWE...');
        const address = await signer.getAddress();
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: messages?.siweStatement,
          uri: window.location.origin,
          version: '1',
          chainId: parseInt(chainId as string),
          nonce: await getCsrfToken(),
        });
        const signature = await signer?.signMessage(message.prepareMessage());
        const userInfo = !isCypressRunning()
          ? await safeAuth?.getUserInfo()
          : {};
        const signInRes = await signIn('credentials', {
          message: JSON.stringify(message),
          redirect: false,
          signature,
          address,
          email: userInfo?.email,
        });
        if (signInRes?.error) {
          console.error('Error signing in with SIWE:', signInRes?.error);
          if (messages?.errorSigningInWithSiwe) {
            toast({
              variant: 'destructive',
              title: messages.errorSigningInWithSiwe.title,
              description: messages.errorSigningInWithSiwe.description,
              action: (
                <ToastAction
                  onClick={login}
                  altText={messages.errorSigningInWithSiwe.tryAgainButton}
                >
                  {messages.errorSigningInWithSiwe.tryAgainButton}
                </ToastAction>
              ),
            });
          }
          throw new Error('Error signing in with SIWE');
        } else {
          router.refresh();
        }
      } catch (error) {
        if (messages?.siweDeclined) {
          toast({
            title: messages.siweDeclined.title,
            description: messages.siweDeclined.description,
            action: (
              <ToastAction
                onClick={login}
                altText={messages.siweDeclined.tryAgainButton}
              >
                {messages.siweDeclined.tryAgainButton}
              </ToastAction>
            ),
          });
        }
        throw new Error('Signing in with SIWE declined');
      }
    },
    [
      messages?.siweStatement,
      messages?.errorSigningInWithSiwe,
      messages?.siweDeclined,
      router,
      toast,
      login,
    ]
  );

  async function finishLogin() {
    console.log('provider connected:', { session });
    if (!session?.user) {
      const web3Provider = new ethers.providers.Web3Provider(
        safeAuth?.getProvider() as ethers.providers.ExternalProvider
      );
      const signer = web3Provider.getSigner(0);
      await loginSiwe(signer);
    }
    await setupUserSession();
    setConnecting(false);
  }

  // when the provider (wallet) is connected, login to siwe or bypass if cookie is present
  useEffect(() => {
    (async () => {
      try {
        console.log('PROVIDER: ', { provider });
        if (safeAuth?.web3Auth?.connected) {
          await finishLogin();
        }
      } catch (error) {
        console.warn({ error });
        await logout({ refresh: false });
      }
    })();
    // Avoid putting the rest of dependencies in the array, it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, session?.user]);

  useEffect(() => {
    (async () => {
      const logos = {
        dark: `/logo-light.svg`,
        light: `/logo-dark.svg`,
      };
      console.log('setting safeAuthKit', { resolvedTheme, locale });
      const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';
      const web3AuthNetwork = process.env
        .NEXT_PUBLIC_WEB3AUTH_NETWORK as Web3AuthOptions['web3AuthNetwork'];
      const sessionTime =
        parseInt(process.env.NEXT_PUBLIC_WEB3AUTH_SESSION_TIME as string) ||
        30 * 24 * 60 * 60;
      const options: Web3AuthOptions = {
        clientId,
        web3AuthNetwork,
        chainConfig: {
          ...chainConfig,
          chainId,
        },
        uiConfig: {
          defaultLanguage: locale as LANGUAGE_TYPE,
          logoLight: logos.light,
          logoDark: logos.dark,
          mode: resolvedTheme,
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
        // used to not show the torus option
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

      const metamaskAdapter = new MetamaskAdapter({
        clientId,
        sessionTime,
        web3AuthNetwork,
        chainConfig: {
          chainId,
          ...chainConfig,
        },
      });

      const whiteLabel = {
        // TODO adapt here with Offline branding, https://web3auth.io/docs/sdk/web/openlogin#whitelabel
        appName: 'Offline',
        appUrl: getNextAppURL(),
        logoLight: logos.light,
        logoDark: logos.dark,
        mode: resolvedTheme,
        defaultLanguage: locale as LANGUAGE_TYPE,
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'default',
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel,
        },
        sessionTime,
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: safeTxServiceUrl,
      });

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter, metamaskAdapter],
        modalConfig,
      });

      setSafeAuth(web3AuthModalPack);

      const safeProvider: ExternalProvider | null =
        web3AuthModalPack.getProvider();
      setProvider(safeProvider);
      web3AuthModalPack.subscribe(ADAPTER_EVENTS.ERRORED, web3AuthErrorHandler);
      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTING, () =>
        setConnecting(true)
      );
      // here evaluate if user is logged in with web3auth. If it's not the case we logout the user from next auth.
      if (safeAuth?.web3Auth?.connected) {
        setConnecting(true);
        setLoggedIn(true);
      } else logoutSiwe({ refresh: false });
      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.ERRORED,
          web3AuthErrorHandler
        );
        web3AuthModalPack.unsubscribe(ADAPTER_EVENTS.CONNECTING, () => null);
      };
    })();
    // IMPORTANT: keep only resolvedTheme and locale in the dependency array, otherwise it could create an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, locale]);

  return {
    safeAuth,
    safeUser,
    provider,
    login,
    logout,
    loginSiwe,
    logoutSiwe,
    connecting,
  };
}
