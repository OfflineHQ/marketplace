import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface EventPassNftsInfosProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
  title: string;
}

export function EventPassNftsInfos({
  eventPass,
  title,
}: EventPassNftsInfosProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftsInfos',
  );
  return (
    <AccordionItem value="nft-infos">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="grid gap-4 py-4">
        <>
          <div className="grid grid-cols-2 gap-4 border-b border-border/50 py-2">
            <p className="font-medium">{t('image')}</p>
            <p className="text-right">
              <AspectRatio variant="classic">
                <Image
                  className="rounded-sm object-cover"
                  src={eventPass?.nftImage?.url || '/image-placeholder.svg'}
                  fill
                  alt={eventPass.nftName}
                />
              </AspectRatio>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-border/50 py-2">
            <p className="font-medium">{t('name')}</p>
            <p className="text-right">{eventPass.nftName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 py-2">
            <p className="font-medium">{t('description')}</p>
            <p className="text-right">{eventPass.nftDescription}</p>
          </div>
        </>
      </AccordionContent>
    </AccordionItem>
  );
}
