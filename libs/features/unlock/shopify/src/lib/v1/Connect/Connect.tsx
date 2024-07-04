import { ProfileAvatar } from '@features/app-nav';
import { interpolateString } from '@next/i18n';
import { useIframeConnect } from '@next/iframe';
import { useWalletAuth } from '@next/wallet';
import { Button, ButtonSkeleton } from '@ui/components';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { useShopifyCustomer } from '../../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../../types';

export interface ConnectAdditionalData {
  [ShopifyCustomerStatus.NotConnected]: {
    connectToShopify: string;
  };
  // here we will first initiate a sign in with passkey. If get error no associated passkey then we will create a new one.
  [ShopifyCustomerStatus.NewAccount]: {
    useExistingAccount: string;
    createNewAccount: string;
  };
  // here mean that user as no associated customer on the brand but have an existing wallet (passkey). See as a fallback (no associated passkey) to propose to create a new account ?
  [ShopifyCustomerStatus.ExistingAccountNewCustomer]: {
    useExistingAccount: string;
    createNewAccount: string;
  };
  [ShopifyCustomerStatus.MatchingAccount]: {
    useExistingAccount: string;
  };
  // here we will first initiate a sign in with passkey. If get error no associated passkey (or not a matching one to the linked customer) then we will initiate recovery.
  // recovery could be if that we create a new passkey.
  [ShopifyCustomerStatus.NoMatchingAccount]: {
    useExistingAccount: string;
    createNewAccount: string;
  };
}

export const V1Connect = () => {
  const locale = 'en';
  const { isReady: isWalletReady } = useWalletAuth();
  const {
    shopifyContext,
    status: shopifyCustomerStatus,
    walletToConnect,
    walletInStorage,
    additionalData,
  } = useShopifyCustomer<ConnectAdditionalData>();
  const { connectToShopify } = useIframeConnect();
  const { connectWalletMutation, accountNotMatching } = useConnectWallet();
  if (!isWalletReady || !shopifyCustomerStatus || !additionalData)
    return <ButtonSkeleton />;

  const renderStatusActions = () => {
    switch (shopifyCustomerStatus) {
      case ShopifyCustomerStatus.NotConnected:
        return (
          <Button block onClick={() => connectToShopify()}>
            {interpolateString(
              additionalData[shopifyCustomerStatus].connectToShopify,
              locale,
              shopifyContext,
            )}
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
              {interpolateString(
                additionalData[shopifyCustomerStatus].createNewAccount,
                locale,
                shopifyContext,
              )}
            </Button>
            <Button
              variant="secondary"
              block
              onClick={() => connectWalletMutation.mutateAsync({})}
            >
              {interpolateString(
                additionalData[shopifyCustomerStatus].useExistingAccount,
                locale,
                shopifyContext,
              )}
            </Button>
          </>
        );
      case ShopifyCustomerStatus.ExistingAccountNewCustomer:
      case ShopifyCustomerStatus.MatchingAccount:
        return (
          <Button
            block
            onClick={() =>
              connectWalletMutation.mutateAsync({ walletToConnect })
            }
          >
            {interpolateString(
              additionalData[shopifyCustomerStatus].useExistingAccount,
              locale,
              shopifyContext,
            )}
          </Button>
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
              {interpolateString(
                additionalData[shopifyCustomerStatus].createNewAccount,
                locale,
                shopifyContext,
              )}
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
              <span>
                {interpolateString(
                  additionalData[shopifyCustomerStatus].useExistingAccount,
                  locale,
                  shopifyContext,
                )}
              </span>
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
};
