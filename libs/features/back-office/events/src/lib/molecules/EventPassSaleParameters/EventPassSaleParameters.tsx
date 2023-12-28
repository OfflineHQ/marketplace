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
      disabled={!eventPass.passAmount?.maxAmount}
    >
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="grid gap-4 py-4">
        <>
          <div className="grid grid-cols-2 gap-4 border-b border-border/50 py-2">
            <p className="font-medium">{t('max-amount')}</p>
            <p className="text-right">{eventPass.passAmount?.maxAmount}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-border/50 py-2">
            <p className="font-medium">{t('max-amount-per-user')}</p>
            <p className="text-right">
              {eventPass.passAmount?.maxAmountPerUser || ''}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 py-2">
            <p className="font-medium">{t('price')}</p>
            <p className="text-right">
              <ConvertedCurrency
                variant={'small'}
                className="text-right"
                amount={eventPass.passPricing?.amount || 0}
                currency={eventPass.passPricing?.currency}
              />
            </p>
          </div>
        </>
      </AccordionContent>
    </AccordionItem>
  );
}
