'use client';

import { ProfileAvatar } from '@features/app-nav';
import { interpolateString, Locale } from '@next/i18n';
import { useWalletAuth } from '@next/wallet';
import { Button } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../types';
import { OffKeyAuthSkelton } from './OffKeyAuthSkelton';

import { useIframeConnect } from '@next/iframe';
import { useConnectWallet } from '../hooks/useConnectWallet';
import { OffKeyAuthSignIn } from './OffKeyAuthSignIn';

export interface OffKeyAuthProps {
  organizerId: string;
  textAuth: {
    connectToShopify: string;
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
    isReady: isWalletReady,
    isConnecting,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const { connectWalletMutation, accountNotMatching } = useConnectWallet();
  const {
    shopifyContext,
    status: shopifyCustomerStatus,
    walletToConnect,
    walletInStorage,
  } = useShopifyCustomer();
  const { connectToShopify } = useIframeConnect();
  if (!isWalletReady || !shopifyCustomerStatus) return <OffKeyAuthSkelton />;
  const texts = {
    connectToShopify: interpolateString(
      textAuth.connectToShopify,
      locale,
      shopifyContext,
    ),
    createNewAccount: interpolateString(
      textAuth.createNewAccount,
      locale,
      shopifyContext,
    ),
    useExistingAccount: interpolateString(
      textAuth.useExistingAccount,
      locale,
      shopifyContext,
    ),
    noMatchingAccount: {
      useExistingAccount: interpolateString(
        textAuth.noMatchingAccount.useExistingAccount,
        locale,
        shopifyContext,
      ),
      recoverMyAccount: interpolateString(
        textAuth.noMatchingAccount.recoverMyAccount,
        locale,
        shopifyContext,
      ),
    },
    signIn: interpolateString(textAuth.signIn, locale, shopifyContext),
    useAnotherAccount: interpolateString(
      textAuth.useAnotherAccount,
      locale,
      shopifyContext,
    ),
  };
  const renderStatusActions = () => {
    switch (shopifyCustomerStatus) {
      case ShopifyCustomerStatus.NotConnected:
        return (
          <Button block onClick={() => connectToShopify()}>
            {texts.connectToShopify}
          </Button>
        );
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
