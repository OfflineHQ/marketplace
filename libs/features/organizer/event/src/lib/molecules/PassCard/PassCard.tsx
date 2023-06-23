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

import type { EventPass } from '../../types';
import { PassCardSelect, PassCardSelectProps } from './PassCardSelect';

export interface PassCardProps extends EventPass, PassCardSelectProps {}

export const PassCard: React.FC<PassCardProps> = ({
  name,
  description,
  price,
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
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Text>{formatCurrency(format, price)}</Text>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <PassCardSelect {...props} />
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
