'use client';

import { interpolateString, Locale } from '@next/i18n';
import { Text, TextSkeleton } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { ShopifyCustomerStatus } from '../types';

export interface OffKeyGateSignInProps {
  organizerId: string;
  textGateSignIn: {
    notConnected: string;
    existingAccountNewCustomer: string;
    newAccount: string;
    matchingAccount: string;
    noMatchingAccount: string;
  };
  locale: Locale;
}

export default function OffKeyGateSignIn({
  organizerId,
  textGateSignIn,
  locale,
}: OffKeyGateSignInProps) {
  const { customer, status } = useShopifyCustomer({ organizerId });

  if (!status) return <TextSkeleton variant="p" className="mx-2 mt-3" />;

  let displayText;
  switch (status) {
    case ShopifyCustomerStatus.NotConnected:
      displayText = interpolateString(textGateSignIn.notConnected, locale);
      break;
    case ShopifyCustomerStatus.ExistingAccountNewCustomer:
      displayText = interpolateString(
        textGateSignIn.existingAccountNewCustomer,
        locale,
        customer,
      );
      break;
    case ShopifyCustomerStatus.NewAccount:
      displayText = interpolateString(
        textGateSignIn.newAccount,
        locale,
        customer,
      );
      break;
    case ShopifyCustomerStatus.MatchingAccount:
      displayText = interpolateString(
        textGateSignIn.matchingAccount,
        locale,
        customer,
      );
      break;
    case ShopifyCustomerStatus.NoMatchingAccount:
      displayText = interpolateString(
        textGateSignIn.noMatchingAccount,
        locale,
        customer,
      );
      break;
  }

  return (
    <Text variant="p" className="mt-2 px-2">
      {displayText}
    </Text>
  );
}
