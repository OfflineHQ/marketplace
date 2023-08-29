import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitleSkeleton,
  CardDescriptionSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  Text,
} from '@ui/components';

import { NextIntlClientProvider, useLocale, useFormatter } from 'next-intl';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';

import { formatCurrency } from '@next/currency';

import type { EventPass } from '@features/organizer/event-types';
import { PassCardSelect, PassCardSelectProps } from './PassCardSelect';
import { PassOptions } from '../PassOptions/PassOptions';

export interface PassCardProps extends EventPass, PassCardSelectProps {}

export const PassCard: React.FC<PassCardProps> = ({
  name,
  description,
  eventPassPricing,
  passOptions,
  ...props
}) => {
  const format = useFormatter();
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchase.Pass',
  ]);
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <PassOptions passOptions={passOptions || []} />
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Text>
          {formatCurrency(format, {
            amount: eventPassPricing?.priceAmount || 0,
            currency: eventPassPricing?.priceCurrency,
          })}
        </Text>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <PassCardSelect {...props} eventPassPricing={eventPassPricing} />
        </NextIntlClientProvider>
      </CardFooter>
    </Card>
  );
};

export const PassCardSkeleton: React.FC = () => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <CardTitleSkeleton />
      <CardDescriptionSkeleton />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <TextSkeleton />
        <ButtonSkeleton />
      </div>
    </CardContent>
  </Card>
);
