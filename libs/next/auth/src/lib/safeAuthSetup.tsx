'use client';

import { ToastAction, useToast } from '@ui/components';
import { usePostHog } from 'posthog-js/react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from '@next/navigation';
import { signIn, signOut } from 'next-auth/react';

import { ComethWallet } from '@cometh/connect-sdk';
import { handleUnauthenticatedUser } from '@next/next-auth/user';
import { useWalletAuth } from '@next/wallet';
import { Session } from 'next-auth';

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
  session?: Session | null;
  isConnected?: () => boolean;
  createAccount?: () => void;
}

export function useSafeAuth({
  messages,
  session,
  isConnected,
  ...props
}: UseSafeAuthProps = {}) {
  const [connecting, setConnecting] = useState(false);
  const {
    connectWithSiwe,
    disconnect,
    isReady,
    isConnecting: isWalletConnecting,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const { toast } = useToast();
  const router = useRouter();
  const isSigningInRef = useRef(false);
  const posthog = usePostHog();

  // signin with siwe to provide a JWT through next-auth
  const loginSiwe = useCallback(
    async (signer: ComethWallet) => {
      try {
        if (isSigningInRef.current) {
          console.log('Already signed in with SIWE, ignoring extra call...');
          return;
        }
        isSigningInRef.current = true;
        console.log('Signing in with SIWE...');
        const address = await signer.getAddress();
        const message = 'Offline'; // EIP1271: secure because signature verified by smart contract against the hash of this message and send back the magic bytes. So really it can be any message.
        const signature = await signer.signMessage(message);
        const signInRes = await signIn('credentials', {
          message,
          redirect: false,
          signature,
          address,
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
          } else throw new Error('Error signing in with SIWE');
        } else {
          identifyUserPostHog(address);
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
      } finally {
        isSigningInRef.current = false;
      }
    },
    [
      messages?.siweStatement,
      messages?.errorSigningInWithSiwe,
      messages?.siweDeclined,
      router,
      toast,
    ],
  );

  const identifyUserPostHog = useCallback(
    (address: string) => {
      console.log('identify posthog', posthog, address);
      posthog?.identify(address, {
        address,
      });
    },
    [posthog],
  );

  const login = useCallback(async () => {
    await connectWithSiwe(loginSiwe);
  }, [connectWithSiwe, loginSiwe]);

  const logoutSiwe = useCallback(
    async ({ refresh }: { refresh?: boolean }) => {
      console.log('Signing out with SIWE...');
      await signOut({ redirect: false });
      if (refresh) router.refresh();
    },
    [router],
  );

  const loginAuto = useCallback(
    async (address: string) => {
      if (!!session?.user && session?.user?.address !== address) {
        await logoutSiwe({ refresh: false });
      }
      console.log('Auto login with SIWE...', address);
      const instance = await connectWithSiwe(loginSiwe, address, true);
      if (!instance) throw new Error('Error connecting with SIWE');
      else await loginSiwe(instance);
    },
    [connectWithSiwe, loginSiwe, logoutSiwe, session],
  );

  const logoutUserPostHog = useCallback(() => {
    console.log('reset posthog');
    posthog?.reset();
  }, [posthog]);

  const logout = useCallback(
    async ({ refresh }: { refresh?: boolean }) => {
      await disconnect();
      await logoutSiwe({ refresh });
      logoutUserPostHog();
    },
    [disconnect, logoutSiwe, logoutUserPostHog],
  );

  const createAccount = useCallback(async () => {
    await connectWithSiwe(loginSiwe, undefined, true);
  }, [connectWithSiwe, loginSiwe]);

  useEffect(() => {
    (async () => {
      // useWalletAuth is not ready yet
      if (!isReady) {
        return;
      }
      const isFirefox = /firefox/i.test(navigator.userAgent);
      const isNextAuthConnected = isConnected ? await isConnected() : false;
      if (isFirefox) {
        // TODO: handle alert because firefox doesn't support passkeys yet
      }
      console.log({
        isNextAuthConnected,
        useE2EAuthContext: window?.useE2EAuthContext,
        NEXT_PUBLIC_E2E_TEST: process.env.NEXT_PUBLIC_E2E_TEST,
      });

      setConnecting(true);
      // if user is connected to next auth, proceed with auto login to wallet
      if (
        isNextAuthConnected ||
        (window?.useE2EAuthContext && process.env.NEXT_PUBLIC_E2E_TEST)
      ) {
        // bypass real login for e2e tests
        if (window.useE2EAuthContext && process.env.NEXT_PUBLIC_E2E_TEST) {
          console.log('Using E2E Auth Context');
        } else if (!wallet && !isWalletConnecting && isReady) {
          await connectWithSiwe(loginSiwe, session?.user?.address, true);
        } else {
          console.log('User connected');
        }
      }
      // if user is connected to wallet but not to next auth, proceed with SIWE to create cookie
      else if (wallet) {
        await loginSiwe(wallet);
      }
      // user is neither connected to next auth nor wallet, proceed with unauthenticated user
      else {
        console.log('User not connected');
        handleUnauthenticatedUser();
        // await logoutSiwe({ refresh: false });
        logoutUserPostHog();
      }
      setConnecting(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return {
    login,
    loginAuto,
    logout,
    createAccount,
    isReady,
    connecting: connecting || isWalletConnecting,
  };
}
