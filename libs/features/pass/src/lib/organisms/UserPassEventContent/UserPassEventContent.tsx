import type { EventWithEventPassNfts } from '@features/pass-types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TextSkeleton,
  Separator,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  ButtonSkeleton,
  AspectRatio,
  DropdownMenuActions,
  type DropdownMenuActionsProps,
} from '@ui/components';
import Image from 'next/image';
import { Download } from '@ui/icons';
import { useTranslations } from 'next-intl';
import {
  UserPassEventPassActions,
  type UserPassEventPassActionsFunctionsProps,
} from '../../molecules/UserPassEventPassActions/UserPassEventPassActions';

export interface UserPassEventContentProps
  extends UserPassEventPassActionsFunctionsProps {
  eventParameters: EventWithEventPassNfts;
}

export const UserPassEventContent: React.FC<UserPassEventContentProps> = ({
  eventParameters,
  actionsFunctions,
}) => {
  const t = useTranslations('Pass.UserPass.UserPassEventContent');

  return (
    <AccordionContent className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-4">
      {eventParameters.eventPassNftContracts.map((eventPassNftContract) => (
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
                  <Text>
                    {t('pass-number', { number: eventPassNft.tokenId })}
                  </Text>
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
            <Button className="w-full" icon={<Download />} block>
              {t('download-passes-button', {
                numPass: eventPassNftContract.eventPassNfts.length,
              })}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </AccordionContent>
  );
};
