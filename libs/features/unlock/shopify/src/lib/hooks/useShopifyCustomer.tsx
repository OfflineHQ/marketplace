import { useGetShopifyCustomerQuery } from '@gql/anonymous/react-query';
import { useIframeOffKey } from '@next/iframe';
import { useWalletContext } from '@next/wallet';
import { ShopifyCustomerStatus } from '../types';

export interface UseShopifyCustomerProps {
  organizerId: string;
}
export function useShopifyCustomer({ organizerId }: UseShopifyCustomerProps) {
  const { customer, isReady } = useIframeOffKey();
  const { walletInStorage } = useWalletContext();
  const { data, isLoading, error } = useGetShopifyCustomerQuery(
    {
      organizerId,
      customerId: customer?.id || '',
    },
    { enabled: !!customer?.id },
  );
  // means the iframe parent is not ready
  if (!isReady)
    return {
      customer: null,
      status: null,
    };
  // means the iframe parent is ready but the customer is not connected
  else if (!customer) {
    return {
      customer: null,
      status: ShopifyCustomerStatus.NotConnected,
    };
  }
  // means the iframe parent is ready and the customer is connected but the data is loading
  else if (isLoading) {
    return {
      customer,
      status: null,
    };
  }
  const shopifyCustomer = data?.shopifyCustomer?.[0];
  // means the iframe parent is ready and the customer is connected but the customer does not have a recorded wallet yet
  if (!shopifyCustomer) {
    return {
      customer,
      status: walletInStorage?.length
        ? ShopifyCustomerStatus.NoRecordedShopifyCustomer
        : ShopifyCustomerStatus.NewAccount,
    };
  }
  const matchingWallet = walletInStorage?.find(
    (wallet) =>
      wallet.address.toLowerCase() === shopifyCustomer.address.toLowerCase(),
  );
  return {
    customer,
    status: matchingWallet
      ? ShopifyCustomerStatus.MatchingWallet
      : ShopifyCustomerStatus.NoMatchingWallet,
    walletToConnect: matchingWallet?.address,
  };
}
