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

import Image from 'next/image';

import { ConvertedCurrency } from '@next/currency';

import type { EventPass } from '@features/organizer/event-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useTranslations } from 'next-intl';
import { EventPassContractDelayedRevealBadge } from '../EventPassContractDelayedRevealBadge/EventPassContractDelayedRevealBadge';
import { PassOptions } from '../PassOptions/PassOptions';
import { PassCardSelect, PassCardSelectProps } from './PassCardSelect';

export interface PassCardProps extends EventPass, PassCardSelectProps {
  className?: string;
  hasConfirmedPasses?: boolean;
}

export const PassCard: React.FC<PassCardProps> = ({
  name,
  description,
  passAmount,
  passPricing,
  passOptions,
  nftImage,
  className,
  hasConfirmedPasses,
  eventPassNftContract,
  ...props
}) => {
  const t = useTranslations('Organizer.Event.PassPurchase.Pass');
  return (
    <Card
      className={`flex h-fit flex-col justify-between ${className}`}
      variant="distinct"
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {eventPassNftContract?.type ===
          EventPassNftContractType_Enum.DelayedReveal && (
          <div className="pt-2">
            <EventPassContractDelayedRevealBadge
              isDelayedRevealed={eventPassNftContract.isDelayedRevealed}
            />
          </div>
        )}
        <CardDescription>{description}</CardDescription>
        <div className="mx-auto flex max-h-[370px] w-full max-w-[350px] py-3">
          <AspectRatio variant="square">
            <Image
              className="rounded-sm object-cover"
              src={nftImage?.url || '/image-placeholder.svg'}
              fill
              alt={name}
            />
          </AspectRatio>
        </div>
        <PassOptions passOptions={passOptions || []} />
      </CardHeader>
      {passAmount && passPricing ? (
        <CardFooter className="flex items-center justify-between">
          <ConvertedCurrency variant="h5" {...passPricing} />
          {hasConfirmedPasses ? null : (
            <PassCardSelect {...props} passAmount={passAmount} />
          )}
        </CardFooter>
      ) : null}
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
