'use client';

import { useIframeOffKey } from '@next/iframe';
import { Text, TextSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';

export default function OffKeyHeaderNotConnected() {
  const t = useTranslations('Shopify.OffKeyHeaderNotConnected');
  const { customer } = useIframeOffKey();
  if (!customer) return <OffKeyHeader title={<TextSkeleton variant="h6" />} />;
  return (
    <OffKeyHeader
      title={
        <Text variant="h6">
          {t('default', {
            customer: customer.firstName || customer.email,
          })}
        </Text>
      }
    />
  );
}
