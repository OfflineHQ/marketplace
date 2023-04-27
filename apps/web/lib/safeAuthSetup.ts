// safeAuthSetup.ts
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  SafeAuthKit,
  SafeAuthSignInData,
  Web3AuthAdapter,
  Web3AuthEventListener,
} from '@web/lib/safe';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3AuthOptions } from '@web3auth/modal';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { ethers } from 'ethers';

// signin with siwe to provide a JWT through next-auth
async function loginSiwe(signer: ethers.Signer) {
  try {
    // setSiweLoading(true);
    console.log('loginSiwe with signer: ', signer);
    // const address = await signer.getAddress();
    // const message = new SiweMessage({
    //   domain: window.location.host,
    //   address,
    //   statement: 'Sign in with Ethereum to the app.',
    //   uri: window.location.origin + '/en',
    //   version: '1',
    //   chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_EIP_155 as string),
    //   nonce: await getCsrfToken(),
    // });
    // const signature = await signer?.signMessage(message.prepareMessage());
    // await signIn('credentials', {
    //   message: JSON.stringify(message),
    //   redirect: false,
    //   signature,
    //   callbackUrl: window.location.href + '/en',
    // });
  } catch (error) {
    console.error(error);
  } finally {
    // setSiweLoading(false);
  }
}

export function useSafeAuth(
  connectedHandler: Web3AuthEventListener,
  disconnectedHandler: Web3AuthEventListener
) {
  const [safeAuth, setSafeAuth] = useState<SafeAuthKit<Web3AuthAdapter>>();

  useEffect(() => {
    (async () => {
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.NEXT_PUBLIC_CHAIN_EIP_155,
          rpcTarget: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
          displayName: process.env.NEXT_PUBLIC_CHAIN_DISPLAY_NAME,
          blockExplorer: process.env.NEXT_PUBLIC_CHAIN_EXPLORER_ENDPOINT,
          ticker: process.env.NEXT_PUBLIC_CHAIN_TICKER,
          tickerName: process.env.NEXT_PUBLIC_CHAIN_TICKER_NAME,
        },
        uiConfig: {
          theme: 'auto',
          loginMethodsOrder: ['google', 'facebook'],
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

      const adapter = new Web3AuthAdapter(options, [openloginAdapter], modalConfig);

      const safeAuthKit = await SafeAuthKit.init(adapter, {
        txServiceUrl: process.env.NEXT_PUBLIC_SAFE_TX_SERVICE_URL,
        loginSiwe,
        logoutSiwe: () => signOut({ callbackUrl: '/', redirect: true }),
      });

      safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      setSafeAuth(safeAuthKit);
    })();

    return () => {
      if (safeAuth) {
        safeAuth.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
        safeAuth.unsubscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);
      }
    };
  }, []);

  return safeAuth;
}
