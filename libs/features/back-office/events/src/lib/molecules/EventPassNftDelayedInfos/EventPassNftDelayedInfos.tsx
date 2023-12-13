import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface EventPassNftDelayedInfosProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
  title: string;
}

export function EventPassNftDelayedInfos({
  eventPass,
  title,
}: EventPassNftDelayedInfosProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftDelayedInfos',
  );
  const eventPassDelayedRevealed = eventPass.eventPassDelayedRevealed;
  return (
    eventPassDelayedRevealed && (
      <AccordionItem value="nft-delayed-infos">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="grid gap-4 border-y py-4">
          <>
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <p className="font-medium">{t('image')}</p>
              <p className="text-right">
                <AspectRatio variant="classic">
                  <Image
                    className="rounded-sm object-cover"
                    src={
                      eventPassDelayedRevealed?.nftImage?.url ||
                      '/image-placeholder.svg'
                    }
                    fill
                    alt={eventPassDelayedRevealed.nftName}
                  />
                </AspectRatio>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <p className="font-medium">{t('name')}</p>
              <p className="text-right">{eventPassDelayedRevealed.nftName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
              <p className="font-medium">{t('description')}</p>
              <p className="text-right">
                {eventPassDelayedRevealed.nftDescription}
              </p>
            </div>
          </>
        </AccordionContent>
      </AccordionItem>
    )
  );
}
