import { DateRangeServer } from '@next/date';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  BadgeSkeleton,
  ButtonSkeleton,
  Separator,
  Text,
  TextSkeleton,
} from '@ui/components';
import {
  UserPassEventCard,
  type UserPassEventCardProps,
} from '../UserPassEventCard/UserPassEventCard';

import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export type UserPassEventProps = Omit<
  UserPassEventCardProps,
  'numPassNotRevealed' | 'eventPassNftContract'
>;

const layout = {
  triggerContainer: 'flex space-x-3',
  image: 'rounded-sm object-cover',
  grid: 'grid max-h-full w-full grid-cols-1 md:grid-cols-6 md:gap-4',
  textContainer:
    'mt-4 space-y-2 md:space-y-4 md:ml-2 text-left flex flex-col justify-start md:justify-center col-span-2 md:col-span-4',
  imageContainer:
    'relative h-32 w-full shrink-0 overflow-hidden rounded-sm md:h-40 md:w-64 col-span-1 md:col-span-2',
  passesTextContainer: 'flex gap-x-2 flex-wrap gap-y-2',
  button: 'self-start',
};

export const UserPassEvent: React.FC<UserPassEventProps> = ({
  eventParameters,
  ...props
}) => {
  const t = useTranslations('Pass.UserPass.UserPassEvent');
  let numPass = 0;
  let numPassRevealed = 0;
  let numPassNotRevealed = 0;
  let onlyEventPassNotRevealed = false;
  for (const eventPassNftContract of eventParameters.eventPassNftContracts) {
    if (
      eventPassNftContract.type ===
        EventPassNftContractType_Enum.DelayedReveal &&
      !eventPassNftContract.isDelayedRevealed
    ) {
      onlyEventPassNotRevealed = true;
    } else onlyEventPassNotRevealed = false;
    numPass += eventPassNftContract.eventPassNfts.length;
    for (const eventPassNft of eventPassNftContract.eventPassNfts) {
      if (eventPassNft.isRevealed) {
        numPassRevealed++;
      } else {
        numPassNotRevealed++;
      }
    }
  }
  return (
    <AccordionItem
      value={eventParameters.event?.slug as string}
      className="mx-5"
    >
      <AccordionTrigger className={layout.triggerContainer}>
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <Image
              src={
                eventParameters.event?.heroImage?.url ||
                '/image-placeholder.svg'
              }
              className={layout.image}
              fill
              alt={eventParameters.event?.title as string}
            />
          </div>
          <div className={layout.textContainer}>
            <Text variant="h5" className="font-semibold">
              {eventParameters.event?.title}
            </Text>
            <DateRangeServer
              className="py-2"
              dateStart={eventParameters.dateStart}
              dateEnd={eventParameters.dateEnd}
              timezone={eventParameters.timezone as string}
            />
            <div className={layout.passesTextContainer}>
              <Badge variant="outline">{t('num-pass', { numPass })}</Badge>
              {numPassNotRevealed > 0 && !onlyEventPassNotRevealed && (
                <Badge variant="orange">
                  {t('num-pass-not-revealed', { numPassNotRevealed })}
                </Badge>
              )}
              {numPassRevealed > 0 && !onlyEventPassNotRevealed && (
                <Badge variant="green">
                  {t('num-pass-revealed', { numPassRevealed })}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-4">
        {eventParameters.eventPassNftContracts.map(
          (eventPassNftContract, index) => (
            <div key={index} className="flex h-full w-full">
              <UserPassEventCard
                eventPassNftContract={eventPassNftContract}
                eventParameters={eventParameters}
                {...props}
              />
            </div>
          ),
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export const UserPassEventSkeleton: React.FC = () => {
  return (
    <div className="mx-5 flex-col">
      <div className="flex items-center space-x-3 py-4">
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <div
              className={`h-full w-full animate-pulse rounded-sm bg-skeleton`}
            />
          </div>
          <div className={`${layout.textContainer} mb-4 space-y-4`}>
            <TextSkeleton variant="h4" />
            <TextSkeleton className="mt-5" />
            <TextSkeleton className="mt-5" />
          </div>
          <div className={`${layout.passesTextContainer} md:col-start-3`}>
            <BadgeSkeleton />
            <BadgeSkeleton />
          </div>
        </div>
        <ButtonSkeleton className="h-4 w-4 rounded-full md:h-8 md:w-8" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
