import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { ConvertedCurrency } from '@next/currency';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventPassSaleParametersProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
  title: string;
}

export function EventPassSaleParameters({
  eventPass,
  title,
}: EventPassSaleParametersProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassSaleParameters',
  );
  return (
    <AccordionItem
      value="nft-parameters"
      disabled={!eventPass.eventPassPricing?.maxAmount}
    >
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="grid gap-4 border-y py-4">
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
      </AccordionContent>
    </AccordionItem>
  );
}
