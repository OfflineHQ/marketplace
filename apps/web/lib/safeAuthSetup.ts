// safeAuthSetup.ts
import React, { useEffect, useState } from 'react';
import {
  SafeAuthKit,
  SafeAuthSignInData,
  SafeGetUserInfoResponse,
  Web3AuthModalPack,
  Web3AuthEventListener,
} from '@web/lib/safe';

import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3AuthOptions } from '@web3auth/modal';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  SafeEventEmitterProvider,
} from '@web3auth/base';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { signIn, signOut, getCsrfToken } from 'next-auth/react';
import { getCurrentUser } from '@web/lib/session';

import { logger } from '@logger';

type ChainConfig = Web3AuthOptions['chainConfig'] & {
  safeTxServiceUrl?: string;
};

const chainConfigs: Record<string, ChainConfig> = {
  goerli: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: 'https://eth-goerli.g.alchemy.com/v2/XGWYfxudDv5ACSpZegVCjkgSrskOpG3v',
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

interface SafeUser
  extends SafeGetUserInfoResponse<Web3AuthModalPack>,
    SafeAuthSignInData {}

export function useSafeAuth(
  connectedHandler: Web3AuthEventListener,
  disconnectedHandler: Web3AuthEventListener
) {
  const [safeAuth, setSafeAuth] = useState<SafeAuthKit<Web3AuthModalPack>>();
  const [safeUser, setSafeUser] = useState<SafeUser>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  // signin with siwe to provide a JWT through next-auth
  const loginSiwe = async (signer: ethers.Signer) => {
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
        console.error('Error signing in with siwe');
        // TODO handle error, show toast
      }
    } catch (error) {
      // TODO handle error, show toast and allow retry
      // if persist send mail to support after retry. Prepare modal for this.
      console.error({ error });
    } finally {
      // setSiweLoading(false);
    }
  };

  const logoutSiwe = async () => {
    return signOut({ redirect: false });
  };

  const setupUserSession = async () => {
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
  };

  const login = async () => {
    if (!safeAuth) return;
    try {
      const signInInfo = await safeAuth.signIn();
      console.log('SIGN IN RESPONSE: ', signInInfo);
      setProvider(safeAuth.getProvider() as SafeEventEmitterProvider);
    } catch (error) {
      console.error(error);
      await logout();
    }
  };

  const logout = async () => {
    if (!safeAuth) return;

    await safeAuth.signOut();
    await logoutSiwe();

    setProvider(null);
    setSafeUser(undefined);
  };

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
  }, [provider]);

  useEffect(() => {
    (async () => {
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          ...chainConfig,
          chainId,
        },
        uiConfig: {
          // TODO apply by theme mode
          appLogo: './logo-dark.svg', // './logo-light.svg',
          theme: 'auto',
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
          mfaLevel: 'mandatory',
          sessionTime:
            parseInt(process.env.TOKEN_LIFE_TIME as string) || 30 * 24 * 60 * 60, // 30 days,
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            // TODO adapt here with Offline branding, https://web3auth.io/docs/sdk/web/openlogin#whitelabel
            name: 'Offline',
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
      safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);

      safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      setSafeAuth(safeAuthKit);

      setProvider(safeAuthKit.getProvider() as SafeEventEmitterProvider);

      return () => {
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);
      };
    })();
  }, []);

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
