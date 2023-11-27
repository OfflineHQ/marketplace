import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { ConvertedCurrency } from '@next/currency';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AspectRatio,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface EventPassNftsInfosProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

export function EventPassNftsInfos({ eventPass }: EventPassNftsInfosProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftsInfos',
  );
  return (
    <AccordionItem value="nft-infos">
      <AccordionTrigger>{t('title')}</AccordionTrigger>
      <AccordionContent className="grid gap-4 border-y py-4">
        <div className="grid grid-cols-2 gap-4 border-b py-2">
          <p className="font-medium">{t('image')}</p>
          <p className="text-right">
            <AspectRatio variant="classic">
              <Image
                src={eventPass?.nftImage?.url || '/image-placeholder.svg'}
                fill
                style={{ objectFit: 'cover' }}
                alt={eventPass.nftName}
              />
            </AspectRatio>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 border-b py-2">
          <p className="font-medium">{t('name')}</p>
          <p className="text-right">{eventPass.nftName}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 border-b py-2">
          <p className="font-medium">{t('description')}</p>
          <p className="text-right">{eventPass.nftDescription}</p>
        </div>
        {!eventPass.eventPassPricing?.maxAmount ? (
          //TODO replace with form for eventPassPricing (with role protection)
          <div className="grid grid-cols-1 py-2">
            <Alert variant="warning">{t('no-event-pass-pricing')}</Alert>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <p className="font-medium">{t('max-amount')}</p>
              <p className="text-right">
                {eventPass.eventPassPricing?.maxAmount}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <p className="font-medium">{t('max-amount-per-user')}</p>
              <p className="text-right">
                {eventPass.eventPassPricing?.maxAmountPerUser || ''}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
              <p className="font-medium">{t('price')}</p>
              <p className="text-right">
                <ConvertedCurrency
                  variant={'small'}
                  className="text-right"
                  amount={eventPass.eventPassPricing?.priceAmount || 0}
                  currency={eventPass.eventPassPricing?.priceCurrency}
                />
              </p>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
