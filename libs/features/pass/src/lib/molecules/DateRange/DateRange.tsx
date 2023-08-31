import React from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { DateRangeClient, type DateRangeClientProps } from './DateRangeClient';

export type DateRangeProps = Omit<DateRangeClientProps, 'fromText' | 'toText'>;

export const DateRange: React.FC<DateRangeProps> = (props) => {
  const locale = useLocale();
  const t = useTranslations('Pass.UserPass.DateRange');
  return (
    <NextIntlClientProvider locale={locale} messages={undefined}>
      <DateRangeClient {...props} fromText={t('from')} toText={t('to')} />
    </NextIntlClientProvider>
  );
};
