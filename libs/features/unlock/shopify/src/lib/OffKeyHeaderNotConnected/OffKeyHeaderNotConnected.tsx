'use client';

import { interpolateString, Locale } from '@next/i18n';
import { Text } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';
import { ShopifyCustomerStatus } from '../types';
import { OffKeyHeaderNotConnectedSkeleton } from './OffKeyHeaderNotConnectedSkeleton';

export interface OffKeyHeaderNotConnectedProps {
  organizerId: string;
  textHeaderNotConnected: {
    customerNotConnected: string;
    customerConnected: string;
  };
  locale: Locale;
}

export default function OffKeyHeaderNotConnected({
  organizerId,
  textHeaderNotConnected,
  locale,
}: OffKeyHeaderNotConnectedProps) {
  const { customer, status, shopifyContext } = useShopifyCustomer();
  if (!status) return <OffKeyHeaderNotConnectedSkeleton />;
  let title;
  if (status !== ShopifyCustomerStatus.NotConnected) {
    title = interpolateString(
      textHeaderNotConnected.customerConnected,
      locale,
      shopifyContext,
    );
  } else {
    title = interpolateString(
      textHeaderNotConnected.customerNotConnected,
      locale,
    );
  }
  return <OffKeyHeader title={<Text variant="h6">{title}</Text>} />;
}
