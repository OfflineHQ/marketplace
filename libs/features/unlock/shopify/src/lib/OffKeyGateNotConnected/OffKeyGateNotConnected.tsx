'use client';

import { interpolateString, Locale } from '@next/i18n';
import { AutoAnimate, Text } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../types';
import { OffKeyGateNotConnectedSkeleton } from './OffKeyGateNotConnectedSkeleton';

export interface OffKeyGateNotConnectedProps {
  className?: string;
  organizerId: string;
  textGateNotConnected: {
    subtitle: {
      [ShopifyCustomerStatus.NotConnected]: string;
      [ShopifyCustomerStatus.ExistingAccountNewCustomer]: string;
      [ShopifyCustomerStatus.NewAccount]: string;
      [ShopifyCustomerStatus.MatchingAccount]: string;
      [ShopifyCustomerStatus.NoMatchingAccount]: string;
    };
    mainText: {
      [ShopifyCustomerStatus.NotConnected]: string;
      [ShopifyCustomerStatus.ExistingAccountNewCustomer]: string;
      [ShopifyCustomerStatus.NewAccount]: string;
      [ShopifyCustomerStatus.MatchingAccount]: string;
      [ShopifyCustomerStatus.NoMatchingAccount]: string;
    };
  };
  locale: Locale;
}

export default function OffKeyGateNotConnected({
  className,
  organizerId,
  textGateNotConnected,
  locale,
}: OffKeyGateNotConnectedProps) {
  const { customer, status } = useShopifyCustomer({ organizerId });

  const textsSubtitle = {
    [ShopifyCustomerStatus.NotConnected]: interpolateString(
      textGateNotConnected.subtitle[ShopifyCustomerStatus.NotConnected],
      locale,
    ),
    [ShopifyCustomerStatus.ExistingAccountNewCustomer]: interpolateString(
      textGateNotConnected.subtitle[
        ShopifyCustomerStatus.ExistingAccountNewCustomer
      ],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.NewAccount]: interpolateString(
      textGateNotConnected.subtitle[ShopifyCustomerStatus.NewAccount],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.MatchingAccount]: interpolateString(
      textGateNotConnected.subtitle[ShopifyCustomerStatus.MatchingAccount],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.NoMatchingAccount]: interpolateString(
      textGateNotConnected.subtitle[ShopifyCustomerStatus.NoMatchingAccount],
      locale,
      customer,
    ),
  };

  const textsMainText = {
    [ShopifyCustomerStatus.NotConnected]: interpolateString(
      textGateNotConnected.mainText[ShopifyCustomerStatus.NotConnected],
      locale,
    ),
    [ShopifyCustomerStatus.ExistingAccountNewCustomer]: interpolateString(
      textGateNotConnected.mainText[
        ShopifyCustomerStatus.ExistingAccountNewCustomer
      ],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.NewAccount]: interpolateString(
      textGateNotConnected.mainText[ShopifyCustomerStatus.NewAccount],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.MatchingAccount]: interpolateString(
      textGateNotConnected.mainText[ShopifyCustomerStatus.MatchingAccount],
      locale,
      customer,
    ),
    [ShopifyCustomerStatus.NoMatchingAccount]: interpolateString(
      textGateNotConnected.mainText[ShopifyCustomerStatus.NoMatchingAccount],
      locale,
      customer,
    ),
  };

  return (
    <AutoAnimate>
      {status ? (
        <div className={`flex flex-col justify-between space-y-2 ${className}`}>
          <div className="flex flex-col space-y-2 px-2">
            <Text variant="h6">{textsSubtitle[status]}</Text>
            <Text variant="p">{textsMainText[status]}</Text>
          </div>
        </div>
      ) : (
        <OffKeyGateNotConnectedSkeleton className={className} />
      )}
    </AutoAnimate>
  );
}
