import { TextSkeleton } from '@ui/components';
import { Calendar as CalendarIcon } from '@ui/icons';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React from 'react';
import { type DateRangeClientProps } from './DateRangeClient';

export const DateRangeSkeleton: React.FC = () => {
  return (
    <div className="my-2 flex items-center space-x-4">
      <CalendarIcon size="lg" />
      <div className="flex flex-col space-y-4">
        <TextSkeleton className="h-6 w-48 md:w-64" />
        <TextSkeleton className="h-6 w-48 md:w-64" />
      </div>
    </div>
  );
};

const DynamicDateRangeClient = dynamic(
  () => import('./DateRangeClient'),
  { ssr: false, loading: () => <DateRangeSkeleton /> } // This will load the component only on client side to get the correct timezone
);

export type DateRangeProps = Omit<
  DateRangeClientProps,
  'fromText' | 'toText' | 'inYourTimezoneText' | 'fromHourText' | 'toHourText'
>;

export const DateRange: React.FC<DateRangeProps> = (props) => {
  const locale = useLocale();
  const t = useTranslations('Pass.UserPass.DateRange');
  return (
    <NextIntlClientProvider locale={locale} messages={undefined}>
      <DynamicDateRangeClient
        {...props}
        fromText={t('from')}
        toText={t('to')}
        fromHourText={t('from-hour')}
        toHourText={t('to-hour')}
        inYourTimezoneText={t('in-your-timezone')}
      />
    </NextIntlClientProvider>
  );
};
