import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { Locale, messages } from '@next/i18n';
import {
  getTableHeaderControlText,
  getTableNoResultText,
  getTablePaginationControlText,
} from '@next/i18n-ui';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import {
  getEventPassNftFiles,
  type GetEventPassNftFilesProps,
} from '../../actions/getEventPassNftFiles';
import { EventPassNftFilesTableClient } from './EventPassNftFilesTableClient';

export interface EventPassNftFilesTableProps extends GetEventPassNftFilesProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

export async function EventPassNftFilesTable({
  eventPass,
  ...props
}: EventPassNftFilesTableProps) {
  const nftFiles = await getEventPassNftFiles(props);
  const locale = useLocale() as Locale;
  const t = await getTranslations({
    locale,
    namespace: 'OrganizerEvents.Sheet.EventPassCard.EventPassNftFilesTable',
  });
  const headerControlText = await getTableHeaderControlText(locale);
  const noResultsText = await getTableNoResultText(locale);
  const paginationPropsText = await getTablePaginationControlText(locale);
  const paginationProps = {
    controlText: paginationPropsText,
  };
  const localeMessages = deepPick(messages[locale], [
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFilesTable',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <EventPassNftFilesTableClient
        data={nftFiles}
        enableRowSelection
        paginationProps={paginationProps}
        noResultsText={noResultsText}
        headerControlText={headerControlText}
      />
    </NextIntlClientProvider>
  );
}
