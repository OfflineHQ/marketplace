import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TableSkeleton,
} from '@ui/components';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Locale, messages } from '@next/i18n';
import { deepPick } from '@utils';
import { EventPassFilesUploader } from '../EventPassFilesUploader/EventPassFilesUploader';
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
  const locale = useLocale() as Locale;
  const localeMessages = deepPick(messages[locale], [
    'OrganizerEvents.Sheet.EventPassCard.EventPassFilesUploader',
  ]);
  return (
    <AccordionItem
      value="nft-pass"
      disabled={!eventPass.eventPassPricing?.maxAmount}
    >
      <AccordionTrigger>{t('title')}</AccordionTrigger>
      <AccordionContent className="w-full flex-col space-y-4 py-4">
        {eventPass.eventPassPricing?.maxAmount ? (
          <>
            {!eventPass.eventPassNftContract && (
              <NextIntlClientProvider locale={locale} messages={localeMessages}>
                <EventPassFilesUploader eventPass={eventPass} {...props} />
              </NextIntlClientProvider>
            )}
            <Suspense fallback={<TableSkeleton rows={10} cols={2} />}>
              <EventPassNftFilesTable
                eventPass={eventPass}
                className="max-w-fit"
                {...props}
              />
            </Suspense>
          </>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
