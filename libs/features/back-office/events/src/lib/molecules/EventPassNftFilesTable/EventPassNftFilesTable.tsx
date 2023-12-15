import { Locale, messages } from '@next/i18n';
import {
  getTableHeaderControlText,
  getTableNoResultText,
  getTablePaginationControlText,
} from '@next/i18n-ui';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  getEventPassNftFiles,
  type GetEventPassNftFilesProps,
} from '../../actions/getEventPassNftFiles';
import {
  EventPassNftFilesTableClient,
  EventPassNftFilesTableClientProps,
} from './EventPassNftFilesTableClient';

export interface EventPassNftFilesTableProps
  extends GetEventPassNftFilesProps,
    Pick<
      EventPassNftFilesTableClientProps,
      | 'className'
      | 'organizerId'
      | 'eventId'
      | 'eventPassId'
      | 'eventPass'
      | 'eventSlug'
    > {}

export async function EventPassNftFilesTable({
  eventPass,
  ...props
}: EventPassNftFilesTableProps) {
  const nftFiles = await getEventPassNftFiles(props);
  const nftFilesModifiedPath = nftFiles.map((file) => ({
    ...file,
    fileName: file.filePath.split('/').pop() || '',
  }));
  const locale = useLocale() as Locale;
  const headerControlText = await getTableHeaderControlText(locale);
  const noResultsText = await getTableNoResultText(locale);
  const paginationPropsText = await getTablePaginationControlText(locale);
  const paginationProps = {
    controlText: paginationPropsText,
  };

  const localeMessages = deepPick(messages[locale], [
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFilesTable',
    'OrganizerEvents.Sheet.EventPassCard.EventPassFilesUploader',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <EventPassNftFilesTableClient
        eventPass={eventPass}
        data={nftFilesModifiedPath}
        paginationProps={paginationProps}
        noResultsText={noResultsText}
        headerControlText={headerControlText}
        {...props}
      />
    </NextIntlClientProvider>
  );
}
