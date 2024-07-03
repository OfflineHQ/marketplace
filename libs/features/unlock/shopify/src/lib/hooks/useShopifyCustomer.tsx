import { useIframeOffKey } from '@next/iframe';
import { useWalletContext } from '@next/wallet';
import { ethers } from 'ethers';
import { ShopifyCustomerStatus } from '../types';

export function useShopifyCustomer<T>() {
  const {
    customer,
    product,
    isReady,
    offKeyState,
    linkedCustomer,
    additionalData,
  } = useIframeOffKey<T>();
  const { walletInStorage } = useWalletContext();

  const shopifyContext = {
    customerFirstName: customer?.firstName,
    customerLastName: customer?.lastName,
    customerEmail: customer?.email,
    productTitle: product?.title,
    productAvailable: product?.available,
  };
  // means the iframe parent is not ready
  if (!isReady)
    return {
      customer: null,
      status: null,
      walletInStorage,
      offKeyState,
      shopifyContext,
      additionalData,
    };
  // means the iframe parent is ready but the customer is not connected
  else if (!customer) {
    return {
      customer: null,
      status: ShopifyCustomerStatus.NotConnected,
      walletInStorage,
      offKeyState,
      shopifyContext,
      additionalData,
    };
  }
  // means the iframe parent is ready and the customer is connected but the call to get linked customer is still loading
  else if (!linkedCustomer) {
    return {
      customer,
      status: null,
      walletInStorage,
      offKeyState,
      shopifyContext,
      additionalData,
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
      shopifyContext,
      additionalData,
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
    shopifyContext,
    additionalData,
  };
}
