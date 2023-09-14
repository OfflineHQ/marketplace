import React from 'react';
import { EventWithEventPassNfts } from '@features/pass-types';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  AspectRatio,
  Badge,
  Text,
  Separator,
} from '@ui/components';
import Image from 'next/image';
import { Download } from '@ui/icons';
import { useTranslations } from 'next-intl';
import {
  UserPassEventPassActions,
  type UserPassEventPassActionsFunctionsProps,
} from '../../molecules/UserPassEventPassActions/UserPassEventPassActions';
import {
  RevealPassesDialog,
  type RevealPassesDialogProps,
} from '../RevealPassesDialog/RevealPassesDialog';

export interface UserPassEventCardProps
  extends UserPassEventPassActionsFunctionsProps,
    Pick<RevealPassesDialogProps, 'eventPassNftContract'> {
  eventParameters: EventWithEventPassNfts;
}

export const UserPassEventCard: React.FC<UserPassEventCardProps> = ({
  eventParameters,
  eventPassNftContract,
  actionsFunctions,
}) => {
  const t = useTranslations('Pass.UserPass.UserPassEventCard');

  const numPassNotRevealed = eventPassNftContract.eventPassNfts.filter(
    (nft) => !nft.isRevealed
  ).length;

  return (
    <Card
      className="flex flex-col"
      variant="distinct"
      key={eventPassNftContract.eventPass?.id}
    >
      <CardHeader className="space-y-4">
        <AspectRatio variant="classic">
          <Image
            src={
              eventPassNftContract.eventPass?.nftImage?.url ||
              '/image-placeholder.svg'
            }
            fill
            style={{ objectFit: 'cover' }}
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
              {eventPassNft.isRevealed ? (
                <Badge variant="green" size="sm">
                  {t('revealed')}
                </Badge>
              ) : (
                <Badge variant="orange" size="sm">
                  {t('not-revealed')}
                </Badge>
              )}
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
          >
            <Button className="w-full" icon={<Download />} block>
              {t('download-passes-button', {
                numPass: eventPassNftContract.eventPassNfts.length,
              })}
            </Button>
          </RevealPassesDialog>
        ) : (
          <Button className="w-full" icon={<Download />} block>
            {t('download-passes-button', {
              numPass: eventPassNftContract.eventPassNfts.length,
            })}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
