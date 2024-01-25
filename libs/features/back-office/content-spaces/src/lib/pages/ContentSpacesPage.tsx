import { AppContainer, AppContainerHeader } from '@features/app-nav';
import { defaultLocale, messages, type Locale } from '@next/i18n';
import { CardTitle, TableSkeleton } from '@ui/components';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import {
  ContentSpacesTable,
  type ContentSpacesTableProps,
} from '../organisms/ContentSpacesTable/ContentSpacesTable';

export type ContentSpacesPageProps = ContentSpacesTableProps;

export function ContentSpacesPage(props: ContentSpacesPageProps) {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'OrganizerContentSpaces.Table',
    'OrganizerContentSpaces.ContentSpaceStatusBadge',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <ContentSpacesTable {...props} />
    </NextIntlClientProvider>
  );
}

export function ContentSpaceTableSkeleton() {
  const t = useTranslations('OrganizerContentSpaces.Table');
  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>{t('title')}</CardTitle>
      </AppContainerHeader>
      <TableSkeleton rows={10} cols={3} />
    </AppContainer>
  );
}
