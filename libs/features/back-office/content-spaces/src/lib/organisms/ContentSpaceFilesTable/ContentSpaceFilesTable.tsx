import { Locale, messages } from '@next/i18n';
import {
  getTableHeaderControlText,
  getTableNoResultText,
  getTablePaginationControlText,
} from '@next/i18n-ui';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  getContentSpaceFiles,
  type GetContentSpaceFilesProps,
} from '../../actions/getContentSpaceFiles';
import {
  ContentSpaceFilesTableClient,
  ContentSpaceFilesTableClientProps,
} from './ContentSpaceFilesTableClient';

export interface ContentSpaceFilesTableProps
  extends GetContentSpaceFilesProps,
    Pick<
      ContentSpaceFilesTableClientProps,
      'className' | 'organizerId' | 'contentSpaceId'
    > {}

export async function ContentSpaceFilesTable(
  props: ContentSpaceFilesTableProps,
) {
  const nftFiles = await getContentSpaceFiles(props);
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
    'OrganizerContentSpaces.Sheet.ContentSpaceFilesTable',
    'OrganizerContentSpaces.Sheet.ContentSpaceFilesUploader',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <ContentSpaceFilesTableClient
        data={nftFilesModifiedPath}
        paginationProps={paginationProps}
        noResultsText={noResultsText}
        headerControlText={headerControlText}
        {...props}
      />
    </NextIntlClientProvider>
  );
}
