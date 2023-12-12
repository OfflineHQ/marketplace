import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TableSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import {
  EventPassNftFilesTable,
  EventPassNftFilesTableProps,
} from '../EventPassNftFilesTable/EventPassNftFilesTable';

export type EventPassNftFilesProps = EventPassNftFilesTableProps;

export function EventPassNftFiles({
  eventPass,
  ...props
}: EventPassNftFilesProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFiles',
  );
  return (
    <AccordionItem
      value="nft-pass"
      disabled={!eventPass.eventPassPricing?.maxAmount}
    >
      <AccordionTrigger>{t('title')}</AccordionTrigger>
      <AccordionContent>
        {eventPass.eventPassPricing?.maxAmount ? (
          <Suspense
            fallback={<TableSkeleton rows={10} cols={2} variant="highlight" />}
          >
            <EventPassNftFilesTable eventPass={eventPass} {...props} />
          </Suspense>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
