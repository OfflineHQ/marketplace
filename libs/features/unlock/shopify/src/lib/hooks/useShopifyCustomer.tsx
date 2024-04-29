import { useIframeOffKey } from '@next/iframe';
import { useWalletContext } from '@next/wallet';
import { ethers } from 'ethers';
import { ShopifyCustomerStatus } from '../types';

export interface UseShopifyCustomerProps {
  organizerId: string;
}
export function useShopifyCustomer({ organizerId }: UseShopifyCustomerProps) {
  const { customer, isReady, offKeyState, linkedCustomer } = useIframeOffKey();
  const { walletInStorage } = useWalletContext();
  // means the iframe parent is not ready
  if (!isReady)
    return {
      customer: null,
      status: null,
      walletInStorage,
      offKeyState,
    };
  // means the iframe parent is ready but the customer is not connected
  else if (!customer) {
    return {
      customer: null,
      status: ShopifyCustomerStatus.NotConnected,
      walletInStorage,
      offKeyState,
    };
  }
  // means the iframe parent is ready and the customer is connected but the call to get linked customer is still loading
  else if (!linkedCustomer) {
    return {
      customer,
      status: null,
      walletInStorage,
      offKeyState,
    };
  }
  // means the iframe parent is ready and the customer is connected but the customer does not have a recorded wallet yet
  if (!linkedCustomer?.address) {
    return {
      customer,
      status: walletInStorage?.length
        ? ShopifyCustomerStatus.ExistingAccountNewCustomer
        : ShopifyCustomerStatus.NewAccount,
      walletInStorage,
      offKeyState,
    };
  }
  const matchingWallet = walletInStorage?.find(
    (wallet) =>
      wallet.address.toLowerCase() === linkedCustomer?.address?.toLowerCase(),
  );
  return {
    customer,
    status: matchingWallet
      ? ShopifyCustomerStatus.MatchingAccount
      : ShopifyCustomerStatus.NoMatchingAccount,
    walletToConnect: matchingWallet
      ? matchingWallet.address
      : ethers.utils.getAddress(linkedCustomer?.address),
    walletInStorage,
    offKeyState,
  };
}
