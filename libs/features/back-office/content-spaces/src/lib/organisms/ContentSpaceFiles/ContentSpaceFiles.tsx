import { TableSkeleton } from '@ui/components';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { ContentSpaceFromOrganizerWithPasses } from '@features/back-office/content-spaces-types';
import { Locale, messages } from '@next/i18n';
import { deepPick } from '@utils';
import { ContentSpaceFilesUploader } from '../ContentSpaceFilesUploader/ContentSpaceFilesUploader';
// import { ContentSpaceFilesUploader } from '../ContentSpaceFilesUploader/ContentSpaceFilesUploader';
// import {
//   ContentSpaceNftFilesTable,
//   ContentSpaceNftFilesTableProps,
// } from '../ContentSpaceNftFilesTable/ContentSpaceNftFilesTable';

export type ContentSpaceNftFilesProps = {
  organizerId: string;
  contentSpace: ContentSpaceFromOrganizerWithPasses;
};

export function ContentSpaceNftFiles({
  contentSpace,
  ...props
}: ContentSpaceNftFilesProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.ContentSpaceCard.ContentSpaceNftFiles',
  );
  const locale = useLocale() as Locale;
  const localeMessages = deepPick(messages[locale], [
    'OrganizerEvents.Sheet.ContentSpaceCard.ContentSpaceFilesUploader',
  ]);
  return (
    <>
      <NextIntlClientProvider locale={locale} messages={localeMessages}>
        <ContentSpaceFilesUploader
          contentSpaceId={contentSpace.id}
          {...props}
        />
      </NextIntlClientProvider>
      <Suspense fallback={<TableSkeleton rows={10} cols={2} />}>
        ContentSpaceNftFilesTable
        {/* <ContentSpaceNftFilesTable
          eventPass={eventPass}
          className="max-w-fit"
          {...props}
        /> */}
      </Suspense>
    </>
  );
}
