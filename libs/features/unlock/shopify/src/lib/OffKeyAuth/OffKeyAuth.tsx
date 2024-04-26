'use client';

import { ProfileAvatar } from '@features/app-nav';
import { interpolateString, Locale } from '@next/i18n';
import { usePathname, useRouter } from '@next/navigation';
import { useWalletAuth } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonSkeleton } from '@ui/components';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../types';

import { ConnectProps, OffKeyAuthSignIn } from './OffKeyAuthSignIn';

export interface OffKeyAuthProps {
  organizerId: string;
  textAuth: {
    createNewAccount: string;
    useExistingAccount: string;
    useAnotherAccount: string;
    noMatchingAccount: {
      useExistingAccount: string;
      recoverMyAccount: string;
    };
    signIn: string;
  };
  locale: Locale;
}

export default function OffKeyAuth({
  organizerId,
  locale,
  textAuth,
}: OffKeyAuthProps) {
  const {
    connect,
    isReady: isWalletReady,
    isConnecting,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const [accountNotMatching, setAccountNotMatching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    customer,
    status: shopifyCustomerStatus,
    walletToConnect,
    walletInStorage,
  } = useShopifyCustomer({
    organizerId,
  });

  const connectWalletMutation = useMutation({
    mutationFn: ({
      walletAddress,
      isCreatingAccount,
      walletToConnect,
    }: ConnectProps) =>
      connect(walletAddress, isCreatingAccount, walletToConnect),
    onSuccess: (
      data,
      { walletAddress, isCreatingAccount, walletToConnect },
      context,
    ) => {
      console.log({ data, walletAddress, isCreatingAccount, context });
      console.log({ pathname, walletAddress });
      let url = `${pathname}/${walletAddress}`;
      if (searchParams?.toString()) {
        const params = new URLSearchParams(searchParams.toString());
        url += `?${params.toString()}`;
      }
      router.replace(url);
    },
    onError: (error: any) => {
      console.error({ error });
      // Handle connection error
      if (error.message.includes('Wallet address does not match')) {
        setAccountNotMatching(true);
      }
    },
  });
  if (!isWalletReady || !shopifyCustomerStatus) return <OffKeyAuthSkelton />;
  else if (shopifyCustomerStatus === ShopifyCustomerStatus.NotConnected)
    return null;
  const texts = {
    createNewAccount: interpolateString(
      textAuth.createNewAccount,
      locale,
      customer,
    ),
    useExistingAccount: interpolateString(
      textAuth.useExistingAccount,
      locale,
      customer,
    ),
    noMatchingAccount: {
      useExistingAccount: interpolateString(
        textAuth.noMatchingAccount.useExistingAccount,
        locale,
        customer,
      ),
      recoverMyAccount: interpolateString(
        textAuth.noMatchingAccount.recoverMyAccount,
        locale,
        customer,
      ),
    },
    signIn: interpolateString(textAuth.signIn, locale, customer),
    useAnotherAccount: interpolateString(
      textAuth.useAnotherAccount,
      locale,
      customer,
    ),
  };
  const renderStatusActions = () => {
    switch (shopifyCustomerStatus) {
      case ShopifyCustomerStatus.NewAccount:
        return (
          <>
            <Button
              block
              onClick={() =>
                connectWalletMutation.mutateAsync({ isCreatingAccount: true })
              }
            >
              {texts.createNewAccount}
            </Button>
            <Button
              variant="secondary"
              block
              onClick={() => connectWalletMutation.mutateAsync({})}
            >
              {texts.useExistingAccount}
            </Button>
          </>
        );
      case ShopifyCustomerStatus.ExistingAccountNewCustomer:
        return (
          <>
            <OffKeyAuthSignIn
              {...{
                signInText: texts.signIn,
                connectWalletMutation,
                walletInStorage,
              }}
            />
            <div className="flex justify-evenly space-x-2">
              <Button
                variant="link"
                className="underline"
                onClick={() =>
                  connectWalletMutation.mutateAsync({ isCreatingAccount: true })
                }
              >
                {texts.createNewAccount}
              </Button>
              <Button
                variant="link"
                className="underline"
                onClick={() => connectWalletMutation.mutateAsync({})}
              >
                {texts.useAnotherAccount}
              </Button>
            </div>
          </>
        );
      case ShopifyCustomerStatus.MatchingAccount:
        return (
          <OffKeyAuthSignIn
            {...{
              signInText: texts.signIn,
              connectWalletMutation,
              walletInStorage,
              walletToConnect,
            }}
          />
        );
      case ShopifyCustomerStatus.NoMatchingAccount:
        //TODO: here we will need to handle the account recovery process (in case no corresponding passkey found)
        // We will indicate the user to use the existing account
        return (
          <>
            <Button
              block
              onClick={() =>
                connectWalletMutation.mutateAsync({ walletToConnect })
              }
            >
              {texts.noMatchingAccount.useExistingAccount}
            </Button>
            <Button
              className="space-x-2"
              variant="secondary"
              block
              onClick={() => {
                //TODO: here we will need to handle the account recovery on a new url made for it
              }}
            >
              <ProfileAvatar
                user={{ id: '', address: walletToConnect as string }}
                size="auto"
              />
              <span>{texts.noMatchingAccount.recoverMyAccount}</span>
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      {renderStatusActions()}
    </div>
  );
}

export function OffKeyAuthSkelton() {
  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      <ButtonSkeleton className="w-full bg-primary" />
      <ButtonSkeleton className="w-full" />
    </div>
  );
}
