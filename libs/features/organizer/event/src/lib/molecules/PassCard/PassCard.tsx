import {
  AspectRatio,
  AspectRatioSkeleton,
  ButtonSkeleton,
  Card,
  CardContent,
  CardDescription,
  CardDescriptionSkeleton,
  CardFooter,
  CardHeader,
  CardTitle,
  CardTitleSkeleton,
  Separator,
  TextSkeleton,
} from '@ui/components';
import React from 'react';

import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useFormatter, useLocale } from 'next-intl';
import Image from 'next/image';

//import { formatCurrency, useCurrency } from '@next/currency';

import type { EventPass } from '@features/organizer/event-types';
import { PassOptions } from '../PassOptions/PassOptions';
import { PassCardSelect, PassCardSelectProps } from './PassCardSelect';

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
  //const { rates, isLoading } = useCurrency();
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
              src={nftImage?.url || '/image-placeholder.svg'}
              fill
              style={{ objectFit: 'cover' }}
              alt={name}
            />
          </AspectRatio>
        </div>
        <PassOptions passOptions={passOptions || []} />
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        {/*isLoading ? (
          <TextSkeleton variant="h5" />
        ) : (
          <Text variant="h5">
            {formatCurrency(
              format,
              {
                amount: eventPassPricing?.priceAmount || 0,
                currency: eventPassPricing?.priceCurrency,
              },
              rates
            )}
          </Text>
            )*/}
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
