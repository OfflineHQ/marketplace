import { useTranslations, useFormatter } from 'next-intl';
import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  Button,
  ButtonSkeleton,
  CardOverlay,
  Text,
  CardDescription,
  AspectRatio,
  CardNavBack,
  Label,
} from '@ui/components';
import { Download, Reveal } from '@ui/icons';
import Image from 'next/image';
import { EventPassNft } from '@features/pass-types';
import { EventOrganizerButton, PassOptions } from '@features/organizer/event';
import { formatCurrency } from '@next/currency';
import type { User } from 'next-auth';
import { IsPassRevealedAlert } from './IsPassRevealedAlert';

export interface SinglePassProps {
  eventPassNft: EventPassNft;
  user?: User;
  downloadPass?: () => void;
  revealPass?: () => void;
}

export const SinglePass: React.FC<SinglePassProps> = ({
  eventPassNft,
  user,
  downloadPass,
  revealPass,
}) => {
  const t = useTranslations('Pass.SinglePass');
  const format = useFormatter();
  const isOwner = useMemo(
    () => user?.address === eventPassNft.currentOwnerAddress,
    [user, eventPassNft]
  );
  const backgroundImage = eventPassNft?.eventPass?.event?.heroImage.url || '';
  const backText = isOwner ? t('back-event-button') : t('see-event-button');
  const backRoute = isOwner
    ? `/pass/event/${eventPassNft?.eventPass?.event?.slug}`
    : `/organizer/${eventPassNft?.eventPass?.event?.organizer?.slug}/event/${eventPassNft?.eventPass?.event?.slug}`;
  return (
    <Card variant="stickyFooter" noBorder className="w-full">
      <CardOverflow>
        <div
          style={
            {
              '--overlay-image': `url(${backgroundImage})`,
            } as React.CSSProperties
          }
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="flex-col bg-overlay-background md:max-h-[400px]"
        >
          <div className="absolute z-10 mt-3 pl-3">
            <CardNavBack
              text={backText}
              variant="secondary"
              href={{ href: backRoute }}
            />
          </div>
          <CardHeader>
            <div className="mx-auto mt-10 flex max-h-[380px] w-full max-w-[350px]">
              <AspectRatio variant="square">
                <Image
                  className="rounded-sm"
                  src={eventPassNft?.eventPass?.nftImage.url || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={eventPassNft?.eventPass?.event?.title || ''}
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col space-y-4 pt-4 md:hidden">
              <Text variant="h2">
                {t('title', {
                  title: eventPassNft.eventPass?.name,
                  number: eventPassNft.tokenId,
                })}
              </Text>
              <Text variant="p">{eventPassNft.eventPass?.description}</Text>
            </div>
          </CardHeader>
        </div>
        <CardContent className="md:relative md:space-y-4">
          <div className="hidden flex-col space-y-4 pt-10 md:flex">
            <Text variant="h2">
              {t('title', {
                title: eventPassNft.eventPass?.name,
                number: eventPassNft.tokenId,
              })}
            </Text>
            <Text variant="p">{eventPassNft.eventPass?.description}</Text>
          </div>
          <div className="flex pb-4 text-end md:pt-4">
            <Label className="mr-3">{t('sold-for')}</Label>
            <Text className="font-semibold">
              {formatCurrency(format, {
                amount:
                  eventPassNft.eventPass?.eventPassPricing?.priceAmount || 0,
                currency:
                  eventPassNft.eventPass?.eventPassPricing?.priceCurrency,
              })}
            </Text>
          </div>
          <div className="flex pb-4">
            <IsPassRevealedAlert
              isOwner={isOwner}
              isRevealed={eventPassNft.isRevealed}
            />
          </div>
          <div className="flex pb-4">
            {eventPassNft.eventPass?.event?.organizer ? (
              <EventOrganizerButton
                {...eventPassNft.eventPass.event.organizer}
              />
            ) : null}
          </div>
          <PassOptions
            passOptions={eventPassNft.eventPass?.passOptions || []}
          />
        </CardContent>
      </CardOverflow>
      {isOwner ? (
        <>
          <CardOverlay />
          <CardFooter className="justify-center" variant="sticky">
            <Button
              className={`w-full md:w-1/3`}
              block
              onClick={eventPassNft.isRevealed ? downloadPass : revealPass}
              icon={eventPassNft.isRevealed ? Download : Reveal}
            >
              {eventPassNft.isRevealed
                ? t('download-button')
                : t('reveal-button')}
            </Button>
            {/* Here can display if pass revealed or not */}
            {/* In case user connected and is owner of the pass, put call to action button 'Reveal Pass' or 'Download Pass'/'Add to Google/Apple Wallet' */}
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
};
