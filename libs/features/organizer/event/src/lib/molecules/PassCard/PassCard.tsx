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
  AspectRatio,
  Label,
  AspectRatioSkeleton,
  Separator,
} from '@ui/components';

import Image from 'next/image';
import { NextIntlClientProvider, useLocale, useFormatter } from 'next-intl';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';

import { formatCurrency } from '@next/currency';

import type { EventPass } from '@features/organizer/event-types';
import { PassCardSelect, PassCardSelectProps } from './PassCardSelect';
import { PassOptions } from '../PassOptions/PassOptions';

export interface PassCardProps extends EventPass, PassCardSelectProps {
  className?: string;
}

export const PassCard: React.FC<PassCardProps> = ({
  name,
  description,
  eventPassPricing,
  passOptions,
  nftImage,
  className,
  ...props
}) => {
  const format = useFormatter();
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchase.Pass',
  ]);
  return (
    <Card className={`flex h-fit flex-col justify-between ${className}`}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mx-auto flex max-h-[370px] w-full max-w-[350px] py-3">
          <AspectRatio variant="square">
            <Image
              className="rounded-sm"
              src={nftImage.url || ''}
              fill
              style={{ objectFit: 'cover' }}
              alt={name}
            />
          </AspectRatio>
        </div>
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
      <AspectRatioSkeleton variant="square" className="mx-auto my-2" />
      <div className="space-y-6 pt-6">
        <TextSkeleton />
        <Separator />
        <TextSkeleton />
        <Separator />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <TextSkeleton />
        <ButtonSkeleton />
      </div>
    </CardContent>
  </Card>
);
