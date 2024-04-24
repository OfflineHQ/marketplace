'use client';

import { useIframeOffKey } from '@next/iframe';
import { Text, TextSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { OffKeyHeader, OffKeyHeaderProps } from '../OffKeyHeader/OffKeyHeader';
import { OffKeyViewHeaderConnected } from '../types';

export interface OffKeyHeaderConnectedProps
  extends Required<Pick<OffKeyHeaderProps, 'profile'>> {
  viewType: OffKeyViewHeaderConnected;
}

export default function OffKeyHeaderConnected({
  profile,
  viewType,
}: OffKeyHeaderConnectedProps) {
  const t = useTranslations('Shopify.OffKeyHeaderConnected');
  const { customer } = useIframeOffKey();
  if (!customer)
    return (
      <OffKeyHeader profile={profile} title={<TextSkeleton variant="h6" />} />
    );
  const viewTypeToText = {
    [OffKeyViewHeaderConnected.Default]: t('connected', {
      customer: customer.firstName || customer.email,
    }),
    [OffKeyViewHeaderConnected.HowToGet]: t('connected-how-to-get-key'),
  };
  return (
    <OffKeyHeader
      profile={profile}
      title={<Text variant="h6">{viewTypeToText[viewType]}</Text>}
    />
  );
}
