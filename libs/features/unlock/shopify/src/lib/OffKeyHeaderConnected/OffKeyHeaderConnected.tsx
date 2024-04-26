'use client';

import { interpolateString, Locale } from '@next/i18n';
import { Text, TextSkeleton } from '@ui/components';
import { OffKeyHeader, OffKeyHeaderProps } from '../OffKeyHeader/OffKeyHeader';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { OffKeyViewHeaderConnected } from '../types';

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
  const { customer } = useShopifyCustomer({
    organizerId,
  });
  if (!customer)
    return (
      <OffKeyHeader profile={profile} title={<TextSkeleton variant="h6" />} />
    );
  const texts = {
    [OffKeyViewHeaderConnected.Default]: interpolateString(
      textHeaderConnected.default,
      locale,
      customer,
    ),
    [OffKeyViewHeaderConnected.HowToGet]: interpolateString(
      textHeaderConnected.howToGet,
      locale,
      customer,
    ),
  };
  return (
    <OffKeyHeader
      profile={profile}
      title={<Text variant="h6">{texts[viewType]}</Text>}
    />
  );
}
