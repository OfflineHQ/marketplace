import { useTranslations } from 'next-intl';
import React from 'react';
import { Text } from '@ui/components';

export default function Home() {
  const t = useTranslations('Index');
  return (
    <div className="p-8">
      <Text>{t('title')}</Text>
    </div>
  );
}
