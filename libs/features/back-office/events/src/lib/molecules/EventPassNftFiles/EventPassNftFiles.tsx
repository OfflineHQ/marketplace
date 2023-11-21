import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventPassNftFilesProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

export function EventPassNftFiles({ eventPass }: EventPassNftFilesProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFiles',
  );
  return (
    <AccordionItem
      value="nft-pass"
      disabled={!eventPass.eventPassPricing?.maxAmount}
    >
      <AccordionTrigger>{t('title')}</AccordionTrigger>
      <AccordionContent></AccordionContent>
    </AccordionItem>
  );
}
