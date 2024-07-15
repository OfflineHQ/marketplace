import { interpolateString } from '@next/i18n';
import { ConnectStatus, useIframeConnect } from '@next/iframe';
import { useWalletAuth } from '@next/wallet';
import { Button, ButtonSkeleton } from '@ui/components';
import { useMemo } from 'react';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { useShopifyCustomer } from '../../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../../types';

export interface ConnectAdditionalData {
  signUpCTAText: string;
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
  const { connectToShopify, connectStatus, askForWalletConnectStatus } =
    useIframeConnect();
  const {
    connectWalletMutation,
    connectToDappMutation,
    retryConnectToDapp,
    accountNotMatching,
  } = useConnectWallet();

  console.log({ shopifyCustomerStatus, isWalletReady, additionalData });
  const isLoading = useMemo(() => {
    const loading =
      connectStatus === ConnectStatus.CONNECTING ||
      connectWalletMutation.status === 'pending' ||
      connectToDappMutation.status === 'pending';
    console.log('isLoading:', loading, {
      connectStatus,
      walletMutationStatus: connectWalletMutation.status,
      dappMutationStatus: connectToDappMutation.status,
    });
    return loading;
  }, [
    connectStatus,
    connectWalletMutation.status,
    connectToDappMutation.status,
  ]);

  if (!isWalletReady || !shopifyCustomerStatus || !additionalData)
    return <ButtonSkeleton className="w-full" />;

  const renderStatusActions = () => {
    switch (shopifyCustomerStatus) {
      case ShopifyCustomerStatus.NotConnected:
        return (
          <Button
            block
            isLoading={isLoading}
            onClick={() => connectToShopify()}
          >
            {interpolateString(
              additionalData.signUpCTAText,
              locale,
              shopifyContext,
            )}
          </Button>
        );
      case ShopifyCustomerStatus.NewAccount:
        return (
          <Button
            block
            isLoading={isLoading}
            onClick={() =>
              connectWalletMutation.mutateAsync({ isCreatingAccount: true })
            }
          >
            {interpolateString(
              additionalData.signUpCTAText,
              locale,
              shopifyContext,
            )}
          </Button>
        );
      case ShopifyCustomerStatus.ExistingAccountNewCustomer:
      case ShopifyCustomerStatus.MatchingAccount:
      case ShopifyCustomerStatus.NoMatchingAccount:
        return (
          <Button
            block
            isLoading={isLoading}
            onClick={() =>
              connectWalletMutation.mutateAsync({ walletToConnect })
            }
          >
            {interpolateString(
              additionalData.signUpCTAText,
              locale,
              shopifyContext,
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      {connectWalletMutation.isSuccess && connectToDappMutation.isError ? (
        <Button isLoading={isLoading} onClick={retryConnectToDapp}>
          {interpolateString(
            additionalData.signUpCTAText,
            locale,
            shopifyContext,
          )}
        </Button>
      ) : (
        renderStatusActions()
      )}
    </div>
  );
};
