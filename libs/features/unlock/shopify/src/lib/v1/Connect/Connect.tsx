import { useIframeConnect } from '@next/iframe';
import { useWalletAuth } from '@next/wallet';
import { ButtonSkeleton } from '@ui/components';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { useShopifyCustomer } from '../../hooks/useShopifyCustomer';
import type { ShopifyCustomerStatus } from '../../types';

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

  return <div>Connect</div>;
};
