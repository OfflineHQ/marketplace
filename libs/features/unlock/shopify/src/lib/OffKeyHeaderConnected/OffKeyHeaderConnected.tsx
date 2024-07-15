'use client';

import { interpolateString, Locale } from '@next/i18n';
import { Text } from '@ui/components';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { OffKeyHeader, OffKeyHeaderProps } from '../OffKeyHeader/OffKeyHeader';
import { OffKeyViewHeaderConnected } from '../types';
import { OffKeyHeaderConnectedSkeleton } from './OffKeyHeaderConnectedSkeleton';

export interface OffKeyHeaderConnectedProps
  extends Required<Pick<OffKeyHeaderProps, 'profile'>> {
  viewType: OffKeyViewHeaderConnected;
  textHeaderConnected: {
    default: string;
    howToGet: string;
  };
  organizerId: string;
  locale: Locale;
}

export default function OffKeyHeaderConnected({
  profile,
  viewType,
  organizerId,
  locale,
  textHeaderConnected,
}: OffKeyHeaderConnectedProps) {
  const { customer, shopifyContext } = useShopifyCustomer();
  if (!customer) return <OffKeyHeaderConnectedSkeleton />;
  const texts = {
    [OffKeyViewHeaderConnected.Default]: interpolateString(
      textHeaderConnected.default,
      locale,
      shopifyContext,
    ),
    [OffKeyViewHeaderConnected.HowToGet]: interpolateString(
      textHeaderConnected.howToGet,
      locale,
      shopifyContext,
    ),
  };
  return (
    <OffKeyHeader
      profile={profile}
      title={<Text variant="h6">{texts[viewType]}</Text>}
    />
  );
}
