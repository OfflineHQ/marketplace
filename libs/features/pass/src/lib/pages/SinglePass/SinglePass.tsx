import {
  AppContainer,
  AppContainerFooter,
  AppContainerNavBack,
  AppContainerNavBackSkeleton,
  AppContainerOverflow,
} from '@features/app-nav';
import { EventOrganizerButton, PassOptions } from '@features/organizer/event';
import { EventPassNft } from '@features/pass-types';
import { ConvertedCurrency } from '@next/currency';
import type { AppUser } from '@next/types';
import {
  AlertSkeleton,
  AspectRatio,
  AspectRatioSkeleton,
  Button,
  ButtonSkeleton,
  CardContent,
  CardHeader,
  Label,
  Separator,
  Text,
  TextSkeleton,
} from '@ui/components';
import { Download, Reveal } from '@ui/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import { IsPassRevealedAlert } from '../../molecules/IsPassRevealedAlert/IsPassRevealedAlert';

export interface SinglePassProps {
  eventPassNft: EventPassNft;
  user?: AppUser;
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
  const isOwner = useMemo(
    () => user?.address === eventPassNft.currentOwnerAddress,
    [user, eventPassNft],
  );
  const backgroundImage = eventPassNft?.eventPass?.event?.heroImage.url || '';
  const backText = isOwner ? t('back-event-button') : t('see-event-button');
  const backRoute = isOwner
    ? `/pass`
    : `/organizer/${eventPassNft?.eventPass?.event?.organizer?.slug}/event/${eventPassNft?.eventPass?.event?.slug}`;
  return (
    <AppContainer>
      <AppContainerNavBack text={backText} href={{ href: backRoute }} />
      <AppContainerOverflow variant={isOwner ? 'stickyFooter' : 'default'}>
        <div
          style={
            {
              '--overlay-image': `url(${backgroundImage})`,
            } as React.CSSProperties
          }
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="flex-col bg-overlay-background md:max-h-[400px]"
        >
          <CardHeader>
            <div className="mx-auto mt-10 flex max-h-[380px] w-full max-w-[350px]">
              <AspectRatio variant="square">
                <Image
                  className="rounded-sm object-cover"
                  src={
                    eventPassNft?.eventPass?.nftImage?.url ||
                    '/image-placeholder.svg'
                  }
                  fill
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
            </div>
          </CardHeader>
        </div>
        <CardContent className="space-y-2 md:relative md:space-y-4" isMain>
          <div className="hidden flex-col space-y-4 pt-10 md:flex">
            <Text variant="h2">
              {t('title', {
                title: eventPassNft.eventPass?.name,
                number: eventPassNft.tokenId,
              })}
            </Text>
          </div>
          <div className="md:w-[50%] md:pt-2">
            <IsPassRevealedAlert
              isOwner={isOwner}
              isRevealed={eventPassNft.isRevealed}
            />
          </div>
          {eventPassNft.eventPass?.passPricing && (
            <div className="flex pb-2 pt-4 text-end">
              <Label className="mr-3">{t('sold-for')}</Label>
              <ConvertedCurrency
                className="font-semibold"
                {...eventPassNft.eventPass.passPricing}
              />
            </div>
          )}

          <div className="flex pb-4">
            {eventPassNft.eventPass?.event?.organizer ? (
              <EventOrganizerButton
                {...eventPassNft.eventPass.event.organizer}
              />
            ) : null}
          </div>
          <Text variant="p">{eventPassNft.eventPass?.description}</Text>
          <PassOptions
            passOptions={eventPassNft.eventPass?.passOptions || []}
          />
        </CardContent>
      </AppContainerOverflow>
      {isOwner ? (
        <AppContainerFooter className="justify-center">
          <Button
            className={`w-full md:w-1/3`}
            block
            onClick={eventPassNft.isRevealed ? downloadPass : revealPass}
            icon={eventPassNft.isRevealed ? <Download /> : <Reveal />}
          >
            {eventPassNft.isRevealed
              ? t('download-button')
              : t('reveal-button')}
          </Button>
          {/* Here can display if pass revealed or not */}
          {/* In case user connected and is owner of the pass, put call to action button 'Reveal Pass' or 'Download Pass'/'Add to Google/Apple Wallet' */}
        </AppContainerFooter>
      ) : null}
    </AppContainer>
  );
};

export const SinglePassSkeleton: React.FC<{ isOwner?: boolean }> = ({
  isOwner = false,
}) => {
  return (
    <AppContainer>
      <AppContainerOverflow variant={isOwner ? 'stickyFooter' : 'default'}>
        <AppContainerNavBackSkeleton />
        <CardHeader>
          <div className="mx-auto mt-10 flex max-h-[380px] w-full max-w-[350px]">
            <AspectRatioSkeleton variant="square" className="mx-auto my-2" />
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <TextSkeleton variant="h2" />
          <Separator />
          <TextSkeleton variant="p" />
          <TextSkeleton />
          <AlertSkeleton />
          <ButtonSkeleton />
        </CardContent>
      </AppContainerOverflow>
      {isOwner ? (
        <AppContainerFooter>
          <ButtonSkeleton />
        </AppContainerFooter>
      ) : null}
    </AppContainer>
  );
};
