'use client';

import { interpolateString, Locale } from '@next/i18n';
import { Text, TextSkeleton } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';
import { ShopifyCustomerStatus } from '../types';

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
  const { customer, status } = useShopifyCustomer({ organizerId });
  if (!status) return <OffKeyHeader title={<TextSkeleton variant="h6" />} />;
  let title;
  if (status !== ShopifyCustomerStatus.NotConnected) {
    title = interpolateString(
      textHeaderNotConnected.customerConnected,
      locale,
      customer,
    );
  } else {
    title = interpolateString(
      textHeaderNotConnected.customerNotConnected,
      locale,
    );
  }
  return <OffKeyHeader title={<Text variant="h6">{title}</Text>} />;
}
