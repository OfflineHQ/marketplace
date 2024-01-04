import { EventWithEventPassNfts } from '@features/pass-types';
import {
  AspectRatio,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Text,
} from '@ui/components';
import { Download } from '@ui/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import {
  UserPassEventPassActions,
  type UserPassEventPassActionsFunctionsProps,
} from '../../molecules/UserPassEventPassActions/UserPassEventPassActions';
import {
  RevealPassesDialog,
  type RevealPassesDialogProps,
} from '../RevealPassesDialog/RevealPassesDialog';

import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { DownloadButtonClient } from './DownloadButtonClient';

export interface UserPassEventCardProps
  extends UserPassEventPassActionsFunctionsProps,
    Pick<
      RevealPassesDialogProps,
      'eventPassNftContract' | 'batchDownloadOrReveal'
    > {
  eventParameters: EventWithEventPassNfts;
}

export const UserPassEventCard: React.FC<UserPassEventCardProps> = ({
  eventParameters,
  eventPassNftContract,
  actionsFunctions,
  batchDownloadOrReveal,
}) => {
  const t = useTranslations('Pass.UserPass.UserPassEventCard');

  const numPassNotRevealed = eventPassNftContract.eventPassNfts.filter(
    (nft) => !nft.isRevealed,
  ).length;

  const isEventPassContractNotRevealed =
    !eventPassNftContract.isDelayedRevealed &&
    eventPassNftContract.type === EventPassNftContractType_Enum.DelayedReveal;

  return (
    <Card
      className="flex w-full flex-col"
      variant="distinct"
      key={eventPassNftContract.eventPass?.id}
    >
      <CardHeader className="space-y-4">
        <AspectRatio variant="classic">
          <Image
            className="rounded-sm object-cover"
            src={
              eventPassNftContract.eventPass?.nftImage?.url ||
              '/image-placeholder.svg'
            }
            fill
            alt={eventPassNftContract.eventPass?.name as string}
          />
        </AspectRatio>
        <CardTitle>{eventPassNftContract.eventPass?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-fit flex-col space-y-4">
        {eventPassNftContract.eventPassNfts.map((eventPassNft, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex items-center space-x-2">
              <Text>{t('pass-number', { number: eventPassNft.tokenId })}</Text>
              {!isEventPassContractNotRevealed &&
                (eventPassNft.isRevealed ? (
                  <Badge variant="green" size="sm">
                    {t('revealed')}
                  </Badge>
                ) : (
                  <Badge variant="orange" size="sm">
                    {t('not-revealed')}
                  </Badge>
                ))}
              <div className="flex grow justify-end">
                <UserPassEventPassActions
                  eventPassNft={eventPassNft}
                  eventPass={eventPassNftContract.eventPass}
                  event={eventParameters.event}
                  organizer={eventParameters.organizer}
                  actionsFunctions={actionsFunctions}
                />
              </div>
            </div>
            {index + 1 < eventPassNftContract.eventPassNfts.length && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        {numPassNotRevealed > 0 ? (
          <RevealPassesDialog
            eventPassNftContract={eventPassNftContract}
            numPassNotRevealed={numPassNotRevealed}
            batchDownloadOrReveal={batchDownloadOrReveal}
          >
            <Button className="w-full" icon={<Download />} block>
              {t('download-passes-button', {
                numPass: eventPassNftContract.eventPassNfts.length,
              })}
            </Button>
          </RevealPassesDialog>
        ) : (
          <DownloadButtonClient
            buttonTxt={t('download-passes-button', {
              numPass: eventPassNftContract.eventPassNfts.length,
            })}
            eventPassNftContract={eventPassNftContract}
            batchDownloadOrReveal={batchDownloadOrReveal}
            buttonToastTxt={{
              successTitle: t('download-passes-toast-success-title', {
                numPass: eventPassNftContract.eventPassNfts.length,
              }),
              successComment: t('download-passes-toast-success-comment', {
                numPass: eventPassNftContract.eventPassNfts.length,
              }),
              errorTitle: t('download-passes-toast-error-title', {
                numPass: eventPassNftContract.eventPassNfts.length,
              }),
              errorComment: t('download-passes-toast-error-comment', {
                numPass: eventPassNftContract.eventPassNfts.length,
              }),
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
};
